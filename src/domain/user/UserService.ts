import bcrypt from 'bcryptjs';
import ApiError from '../../core/errors/ApiError';
import TokenService from '../../services/TokenService';
import MailService from '../../services/MailService';
import randomCode from '../../utils/randomCode';
import AchievementService from '../../services/AchievementService';
import GoalService from '../../services/GoalService';
import {MongoUserRepository} from '../../infrastructure/db/mongoDB/user/MongoUserRepository';
import { UserRepositoryInterface } from './UserRepository';
import { GoogleUserDto } from './dtos/GoogleUserDto';
import { codeService } from '../confirmationCode/CodeService';

export default class UserService {
    constructor (readonly userRepo: UserRepositoryInterface){}
    async registration(email: string, password: string){
        // checking the user for existence
        const condidate = await this.userRepo.findUserByEmail(email)
        if (condidate) {
            throw ApiError.badRequest(
                `User with email ${email} already exists`
            );
        }
        // hashing the password
        const hashPassword = await bcrypt.hash(password, 8);
        // creating the user data to the DB
        const user = await this.userRepo.createUserWithEmail(email, hashPassword);
        // creating DTO of the user, generating the tokens, hashing the refresh token,
        // saving the hash of the token to the DB, returning the user data and tokens
        const authData = await TokenService.tokenService(user);
        // creating default ets
        AchievementService.createDefaultAchievements(user.id);
        return authData;
    }

    async login(email: string, password: string) {
        // checking the user for existence
        const user = await this.userRepo.findUserByEmail(email);
        if (!user) {
            throw ApiError.badRequest(
                `User with email ${email} does not exist`
            );
        }
        // checking the password for correctness
        if (!user.password) {
            throw ApiError.badRequest(`Wrong password`);
        }
        const isTrue = await bcrypt.compare(password, user.password);
        if (!isTrue) {
            throw ApiError.badRequest(`Wrong password`);
        }
        // creating DTO of the user, generating the tokens, hashing the refresh token,
        // saving the hash of the token to the DB, returning the user data and tokens
        const tokens = await TokenService.tokenService(user);
        return tokens;
    }

    async forgot(email: string) {
        // Checking if the user exists
        const user = await this.userRepo.findUserByEmail(email);
        if (!user) {
            throw ApiError.badRequest(`User with mail ${email} does not exist`);
        }
        // generating and sending the random code
        const code = randomCode();
        await MailService.sendResetCode(email, code);
        // hashing the code
        const hashCode = await bcrypt.hash(code, 8);
        // looking for another code
        const codeFromDB = await codeService.findCodeByUserId(user.id);
        // changing the code if we already have it in the DB
        if (codeFromDB) {
            await codeService.updateCodeById(codeFromDB.id, hashCode)
            return { message: 'Code is sent' };
        }
        // creating code in the DB
        await codeService.createCode(user.id, hashCode)
        return { message: 'Code is sent' };
    }

    async checkCode(email: string, code: string) {
        // looking for the user by the email
        const user = await this.userRepo.findUserByEmail(email);
        if (!user) {
            throw ApiError.badRequest(`User with mail ${email} does not exist`);
        }
        // looking for the code by the user ID
        const codeFromDB = await codeService.findCodeByUserId(user.id);
        if (!codeFromDB) {
            throw ApiError.badRequest(`Code does not exist`);
        }
        // checking if the code is true
        const isTrue = await bcrypt.compare(code, codeFromDB.code);
        if (!isTrue) {
            throw ApiError.badRequest('Wrong code');
        }
        return { message: 'Code is okay' };
    }

    async reset(email: string, code: string, password: string) {
        // looking for the user by the email
        const user = await this.userRepo.findUserByEmail(email);
        if (!user) {
            throw ApiError.badRequest(`User with mail ${email} does not exist`);
        }
        // looking for the code by the user ID
        const codeFromDB = await codeService.findCodeByUserId(user.id)
        if (!codeFromDB) {
            throw ApiError.badRequest(`Some error`);
        }
        // checking if the code is true
        const isTrue = await bcrypt.compare(code, codeFromDB.code);
        if (!isTrue) {
            throw ApiError.badRequest('Wrong code');
        }
        // hashing the passwrod
        const hashPassword = await bcrypt.hash(password, 8);
        // updating password
        await this.userRepo.changePassword(user.id, hashPassword)
        // deleting the code from the DB
        await codeService.deleteCode(String(codeFromDB.id))

        return { message: 'Password was changed' };
    }

    async changePassword(
        userId: string,
        oldPassword: string,
        newPassword: string
    ) {
        if (oldPassword === newPassword) {
            throw ApiError.badRequest(
                'New password has to be not the same to old one'
            );
        }
        // find user from DB
        const user = await this.userRepo.findById(userId);
        // user signed up through google account
        if (!user.password) {
            throw ApiError.badRequest(
                'User signed up through google account and does not have password'
            );
        }
        // checking password
        const isTrue = await bcrypt.compare(oldPassword, user.password);
        if (!isTrue) {
            throw ApiError.badRequest('Wrong password');
        }
        // hash new password and change it
        const hashPassword = await bcrypt.hash(newPassword, 8);
        await this.userRepo.changePassword(user.id, hashPassword)
        return { message: 'Password was changed' };
    }

    async confirmEmail(userId: string) {
        const user = await this.userRepo.findById(userId);

        const email = user.email;
        // generating and sending the random code
        const code = randomCode();
        await MailService.sendConfirmCode(email, code);
        // hashing the code
        const hashCode = await bcrypt.hash(code, 8);
        // looking for another code
        const codeFromDB = await codeService.findCodeByUserId(userId)
        // changing the code if we already have it in the DB
        if (codeFromDB) {
            await codeService.updateCodeById(String(codeFromDB.id), hashCode)
            return { message: 'Code is sent' };
        }
        // creating code in the DB
        await codeService.createCode(userId, hashCode)
        return { message: 'Code is sent' };
    }

    async confirmCodeEmail(userId: string, code: string) {
        const user = await this.userRepo.findById(userId);
        // looking for the code by the user ID
        const codeFromDB = await codeService.findCodeByUserId(userId);
        if (!codeFromDB) {
            throw ApiError.badRequest(`Code does not exist`);
        }
        // checking if the code is true
        const isTrue = await bcrypt.compare(code, codeFromDB.code);
        if (!isTrue) {
            throw ApiError.badRequest('Wrong code');
        }

        await this.userRepo.verifyEmail(user.id)
        return { message: 'Email is confirmed' };
    }

    async deleteUser(userId: string) {
        const user = await this.userRepo.findById(userId);

        await this.userRepo.deleteUser(user.id)
        await TokenService.removeTokenById(userId);
        await AchievementService.removeAchievements(userId);
        await GoalService.removeGoals(userId);
        return { message: 'User was deleted' };
    }

    async auth(googleUserDto: GoogleUserDto) {
        const condidate = await this.userRepo.findUserByGoogleId(googleUserDto.googleId);
        if (condidate) {
            const tokens = await TokenService.tokenService(condidate);
            return tokens;
        }

        const condidateWithEmail = await this.userRepo.findUserWithEmail(googleUserDto.email, null);

        if (condidateWithEmail) {
            await this.userRepo.verifyUserWithEmail(condidateWithEmail.id, googleUserDto.googleId)

            return await TokenService.tokenService(condidateWithEmail);
        }

        const user = await this.userRepo.createUserWithGoogleId(googleUserDto.googleId, googleUserDto.email)

        AchievementService.createDefaultAchievements(user.id.toString());
        const tokens = await TokenService.tokenService(user);

        return tokens;
    }
}