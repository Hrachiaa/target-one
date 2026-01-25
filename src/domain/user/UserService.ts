import bcrypt from 'bcryptjs';
import ApiError from '../../core/errors/ApiError';
import MailService from '../../services/MailService';
import randomCode from '../../utils/randomCode';
import AchievementService from '../achievement/AchievementService';
import GoalService from '../plan/PlanService';
import {MongoUserRepository} from '../../infrastructure/db/mongoDB/user/MongoUserRepository';
import { UserRepositoryInterface } from './UserRepository';
import { GoogleUserDto } from './dtos/GoogleUserDto';
import { codeService } from '../confirmationCode/CodeService';
import { UserEntity } from './models/UserEntity';
import { CodeEntity } from '../confirmationCode/models/CodeEntity';
import { tokenService } from '../../server';
import { TokensDto } from '../token/dtos/TokensDto';
import { BalanceDto } from './dtos/UserDto';

interface Message {
    message: string;
}

export default class UserService {
    constructor (readonly userRepo: UserRepositoryInterface){}
    async registration(email: string, password: string): Promise<TokensDto>{
        // checking the user for existence
        const condidate: UserEntity | null = await this.userRepo.findUserByEmail(email)
        if (condidate) {
            throw ApiError.badRequest(
                `User with email ${email} already exists`
            );
        }
        // hashing the password
        const hashPassword: string = await bcrypt.hash(password, 8);
        // creating the user data to the DB
        const user: UserEntity = await this.userRepo.createUserWithEmail(email, hashPassword);
        // creating DTO of the user, generating the tokens, hashing the refresh token,
        // saving the hash of the token to the DB, returning the user data and tokens
        const tokens: TokensDto = await tokenService.tokenService(user);
        // creating default ets
        AchievementService.createDefaultAchievements(user.id);
        return tokens;
    }

    async login(email: string, password: string): Promise<TokensDto> {
        // checking the user for existence
        const user: UserEntity | null = await this.userRepo.findUserByEmail(email);
        if (!user) {
            throw ApiError.badRequest(
                `User with email ${email} does not exist`
            );
        }
        // checking the password for correctness
        if (!user.password) {
            throw ApiError.badRequest(`Wrong password`);
        }
        const isTrue: boolean = await bcrypt.compare(password, user.password);
        if (!isTrue) {
            throw ApiError.badRequest(`Wrong password`);
        }
        // creating DTO of the user, generating the tokens, hashing the refresh token,
        // saving the hash of the token to the DB, returning the user data and tokens
        const tokens: TokensDto = await tokenService.tokenService(user);
        return tokens;
    }

    async forgot(email: string): Promise<Message> {
        // Checking if the user exists
        const user: UserEntity | null = await this.userRepo.findUserByEmail(email);
        if (!user) {
            throw ApiError.badRequest(`User with mail ${email} does not exist`);
        }
        // generating and sending the random code
        const code: string = randomCode();
        await MailService.sendResetCode(email, code);
        // hashing the code
        const hashCode: string = await bcrypt.hash(code, 8);
        // looking for another code
        const codeFromDB: CodeEntity | null = await codeService.findCodeByUserId(user.id);
        // changing the code if we already have it in the DB
        if (codeFromDB) {
            await codeService.updateCodeById(codeFromDB.id, hashCode)
            return { message: 'Code is sent' };
        }
        // creating code in the DB
        await codeService.createCode(user.id, hashCode)
        return { message: 'Code is sent' };
    }

    async checkCode(email: string, code: string):Promise <Message> {
        // looking for the user by the email
        const user: UserEntity | null = await this.userRepo.findUserByEmail(email);
        if (!user) {
            throw ApiError.badRequest(`User with mail ${email} does not exist`);
        }
        // looking for the code by the user ID
        const codeFromDB: CodeEntity | null = await codeService.findCodeByUserId(user.id);
        if (!codeFromDB) {
            throw ApiError.badRequest(`Code does not exist`);
        }
        // checking if the code is true
        const isTrue: boolean = await bcrypt.compare(code, codeFromDB.code);
        if (!isTrue) {
            throw ApiError.badRequest('Wrong code');
        }
        return { message: 'Code is okay' };
    }

    async reset(email: string, code: string, password: string): Promise<Message> {
        // looking for the user by the email
        const user: UserEntity | null = await this.userRepo.findUserByEmail(email);
        if (!user) {
            throw ApiError.badRequest(`User with mail ${email} does not exist`);
        }
        // looking for the code by the user ID
        const codeFromDB: CodeEntity | null = await codeService.findCodeByUserId(user.id)
        if (!codeFromDB) {
            throw ApiError.badRequest(`Some error`);
        }
        // checking if the code is true
        const isTrue: boolean = await bcrypt.compare(code, codeFromDB.code);
        if (!isTrue) {
            throw ApiError.badRequest('Wrong code');
        }
        // hashing the passwrod
        const hashPassword: string = await bcrypt.hash(password, 8);
        // updating password
        await this.userRepo.changePassword(user.id, hashPassword)
        // deleting the code from the DB
        await codeService.deleteCode(codeFromDB.id)

        return { message: 'Password was changed' };
    }

    async changePassword(
        userId: string,
        oldPassword: string,
        newPassword: string
    ): Promise<Message> {
        if (oldPassword === newPassword) {
            throw ApiError.badRequest(
                'New password has to be not the same to old one'
            );
        }
        // find user from DB
        const user: UserEntity = await this.userRepo.findById(userId);
        // user signed up through google account
        if (!user.password) {
            throw ApiError.badRequest(
                'User signed up through google account and does not have password'
            );
        }
        // checking password
        const isTrue: boolean = await bcrypt.compare(oldPassword, user.password);
        if (!isTrue) {
            throw ApiError.badRequest('Wrong password');
        }
        // hash new password and change it
        const hashPassword: string = await bcrypt.hash(newPassword, 8);
        await this.userRepo.changePassword(user.id, hashPassword)
        return { message: 'Password was changed' };
    }

    async confirmEmail(userId: string): Promise<Message> {
        const user: UserEntity = await this.userRepo.findById(userId);

        const email: string = user.email;
        // generating and sending the random code
        const code: string = randomCode();
        await MailService.sendConfirmCode(email, code);
        // hashing the code
        const hashCode: string = await bcrypt.hash(code, 8);
        // looking for another code
        const codeFromDB: CodeEntity | null = await codeService.findCodeByUserId(userId)
        // changing the code if we already have it in the DB
        if (codeFromDB) {
            await codeService.updateCodeById(String(codeFromDB.id), hashCode)
            return { message: 'Code is sent' };
        }
        // creating code in the DB
        await codeService.createCode(userId, hashCode)
        return { message: 'Code is sent' };
    }

    async confirmCodeEmail(userId: string, code: string): Promise<Message> {
        const user: UserEntity = await this.userRepo.findById(userId);
        // looking for the code by the user ID
        const codeFromDB: CodeEntity | null = await codeService.findCodeByUserId(userId);
        if (!codeFromDB) {
            throw ApiError.badRequest(`Code does not exist`);
        }
        // checking if the code is true
        const isTrue: boolean = await bcrypt.compare(code, codeFromDB.code);
        if (!isTrue) {
            throw ApiError.badRequest('Wrong code');
        }

        await this.userRepo.verifyEmail(user.id)
        return { message: 'Email is confirmed' };
    }

    async deleteUser(userId: string): Promise<Message> {
        const user: UserEntity = await this.userRepo.findById(userId);

        await this.userRepo.deleteUser(user.id)
        await tokenService.removeTokenById(userId);
        await AchievementService.removeAchievements(userId);
        await GoalService.removeGoals(userId);
        return { message: 'User was deleted' };
    }

    async auth(googleUserDto: GoogleUserDto): Promise<TokensDto> {
        const condidate: UserEntity | null = await this.userRepo.findUserByGoogleId(googleUserDto.googleId);
        if (condidate) {
            const tokens = await tokenService.tokenService(condidate);
            return tokens;
        }

        const condidateWithEmail: UserEntity | null = await this.userRepo.findUserWithEmail(googleUserDto.email, null);

        if (condidateWithEmail) {
            await this.userRepo.verifyUserWithEmail(condidateWithEmail.id, googleUserDto.googleId)

            return await tokenService.tokenService(condidateWithEmail);
        }

        const user: UserEntity = await this.userRepo.createUserWithGoogleId(googleUserDto.googleId, googleUserDto.email)

        AchievementService.createDefaultAchievements(user.id.toString());
        const tokens: TokensDto = await tokenService.tokenService(user);

        return tokens;
    }

    async getBalance(userId: string): Promise<BalanceDto> {
        const user: UserEntity = await this.userRepo.findById(userId);
        return { balance: user.balance };
    }

    async increaseBalance(userId: string, amount: number): Promise <void> {
        await this.userRepo.changeBalance(userId, amount);
        return ;
    }

    async decreaseBalance(userId: string, amount: number): Promise <void> {
        await this.userRepo.changeBalance(userId, -amount);
        return ;
    }


    async findById(userId: string): Promise<UserEntity>{
        return await this.userRepo.findById(userId)
    }
}