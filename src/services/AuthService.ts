import bcrypt from 'bcryptjs';
import ApiError from '../core/errors/ApiError';
import TokenService from './TokenService';
import MailService from './MailService';
import randomCode from '../utils/randomCode';
import AchievementService from './AchievementService';
import GoalService from './GoalService';
import UserRepository from '../repositories/mongoDB/UserRepository';
import ConfirmationCodeRepository from '../repositories/mongoDB/ConfirmationCodeRepository';
import { AuthData } from '../types/types';

export default class UserService {
    static async registration(email: string, password: string): Promise<AuthData> {
        // checking the user for existence
        const condidate = await UserRepository.findUserByEmail(email);
        if (condidate) {
            throw ApiError.badRequest(
                `User with email ${email} already exists`
            );
        }
        // hashing the password
        const hashPassword = await bcrypt.hash(password, 8);
        // creating the user data to the DB
        const user = await UserRepository.createUserWithEmail(email, hashPassword);
        // creating DTO of the user, generating the tokens, hashing the refresh token,
        // saving the hash of the token to the DB, returning the user data and tokens
        const authData = await TokenService.tokenService(user);
        // creating default ets
        AchievementService.createDefaultAchievements(String(user._id));
        return authData;
    }

    static async login(email: string, password: string) {
        // checking the user for existence
        const user = await UserRepository.findUserByEmail(email);
        console.log(user)
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

    static async forgot(email: string) {
        // Checking if the user exists
        const user = await UserRepository.findUserByEmail(email);
        if (!user) {
            throw ApiError.badRequest(`User with mail ${email} does not exist`);
        }
        // generating and sending the random code
        const code = randomCode();
        await MailService.sendResetCode(email, code);
        // hashing the code
        const hashCode = await bcrypt.hash(code, 8);
        // looking for another code
        const codeFromDB = await ConfirmationCodeRepository.findConfirmatioanCode(String(user._id));
        // changing the code if we already have it in the DB
        if (codeFromDB) {
            await ConfirmationCodeRepository.updateConfirmationCode(String(codeFromDB._id), hashCode)
            return { message: 'Code is sent' };
        }
        // creating code in the DB
        await ConfirmationCodeRepository.createConfirmationCode(String(user._id), hashCode)
        return { message: 'Code is sent' };
    }

    static async checkCode(email: string, code: string) {
        // looking for the user by the email
        const user = await UserRepository.findUserByEmail(email);
        if (!user) {
            throw ApiError.badRequest(`User with mail ${email} does not exist`);
        }
        // looking for the code by the user ID
        const codeFromDB = await ConfirmationCodeRepository.findConfirmatioanCode(String(user._id));
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

    static async reset(email: string, code: string, password: string) {
        // looking for the user by the email
        const user = await UserRepository.findUserByEmail(email);
        if (!user) {
            throw ApiError.badRequest(`User with mail ${email} does not exist`);
        }
        // looking for the code by the user ID
        const codeFromDB = await ConfirmationCodeRepository.findConfirmatioanCode(String(user._id))
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
        await UserRepository.changePassword(String(user._id), hashPassword)
        // deleting the code from the DB
        await ConfirmationCodeRepository.deleteCode(String(codeFromDB._id))

        return { message: 'Password was changed' };
    }

    static async changePassword(
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
        const user = await UserRepository.findById(userId);
        if (!user) {
            throw ApiError.serverError('User not found');
        }
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
        await UserRepository.changePassword(String(user._id), hashPassword)
        return { message: 'Password was changed' };
    }

    static async confirmEmail(userId: string) {
        const user = await UserRepository.findById(userId);
        if (!user) {
            throw ApiError.badRequest('User not found');
        }
        const email = user.email;
        // generating and sending the random code
        const code = randomCode();
        await MailService.sendConfirmCode(email, code);
        // hashing the code
        const hashCode = await bcrypt.hash(code, 8);
        // looking for another code
        const codeFromDB = await ConfirmationCodeRepository.findConfirmatioanCode(userId)
        // changing the code if we already have it in the DB
        if (codeFromDB) {
            await ConfirmationCodeRepository.updateConfirmationCode(String(codeFromDB._id), hashCode)
            return { message: 'Code is sent' };
        }
        // creating code in the DB
        await ConfirmationCodeRepository.createConfirmationCode(userId, hashCode)
        return { message: 'Code is sent' };
    }

    static async confirmCodeEmail(userId: string, code: string) {
        const user = await UserRepository.findById(userId);
        if (!user) {
            throw ApiError.badRequest('User not found');
        }
        // looking for the code by the user ID
        const codeFromDB = await ConfirmationCodeRepository.findConfirmatioanCode(userId);
        if (!codeFromDB) {
            throw ApiError.badRequest(`Code does not exist`);
        }
        // checking if the code is true
        const isTrue = await bcrypt.compare(code, codeFromDB.code);
        if (!isTrue) {
            throw ApiError.badRequest('Wrong code');
        }

        await UserRepository.verifyEmail(String(user._id))
        return { message: 'Email is confirmed' };
    }

    static async deleteUser(userId: string) {
        const user = await UserRepository.findById(userId);
        if (!user) {
            throw ApiError.badRequest('User does not exist');
        }

        await UserRepository.deleteUser(String(user._id))
        await TokenService.removeTokenById(userId);
        await AchievementService.removeAchievements(userId);
        await GoalService.removeGoals(userId);
        return { message: 'User was deleted' };
    }
}
