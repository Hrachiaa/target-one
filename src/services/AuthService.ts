import bcrypt from 'bcryptjs';
import UserModel from '../models/UserModel';
import ApiError from '../core/errors/ApiError';
import TokenService from './TokenService';
import MailService from './MailService';
import randomCode from '../utils/randomCode';
import ConfirmationCodeModel from '../models/ConfirmationCodeModel';
import AchievmentService from './AchievementService';

export default class UserService {
    static async registration(email: string, password: string) {
        // checking the user for existence
        const condidate = await UserModel.findOne({ email });
        if (condidate) {
            throw ApiError.badRequest(
                `User with email ${email} already exists`
            );
        }
        // hashing the password
        const hashPassword = await bcrypt.hash(password, 8);
        // creating the user data to the DB
        const user = await UserModel.create({ email, password: hashPassword });
        // creating DTO of the user, generating the tokens, hashing the refresh token,
        // saving the hash of the token to the DB, returning the user data and tokens
        const tokens = await TokenService.tokenService(user);
        // creating default achievments
        AchievmentService.createDefaultAchievments(user._id.toString());
        return tokens;
    }

    static async login(email: string, password: string) {
        // checking the user for existence
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw ApiError.badRequest(
                `User with email ${email} does not exist`
            );
        }
        // checking the password for correctness
        if (!user.password) {
            throw ApiError.badRequest(
                `User with email ${email} does not exist`
            );
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
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw ApiError.badRequest(`User with mail ${email} does not exist`);
        }
        // generating and sending the random code
        const code = randomCode();
        await MailService.sendResetCode(email, code);
        // hashing the code
        const hashCode = await bcrypt.hash(code, 8);
        // looking for another code
        const codeFromDB = await ConfirmationCodeModel.findOne({
            userId: user._id,
        });
        // changing the code if we already have it in the DB
        if (codeFromDB) {
            codeFromDB.code = hashCode;
            codeFromDB.createdAt = new Date();
            await codeFromDB.save();
            return { message: 'Code is sent' };
        }
        // creating code in the DB
        await ConfirmationCodeModel.create({
            userId: user._id,
            code: hashCode,
        });
        return { message: 'Code is sent' };
    }

    static async checkCode(email: string, code: string) {
        // looking for the user by the email
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw ApiError.badRequest(`User with mail ${email} does not exist`);
        }
        // looking for the code by the user ID
        const codeFromDB = await ConfirmationCodeModel.findOne({
            userId: user._id,
        });
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
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw ApiError.badRequest(`User with mail ${email} does not exist`);
        }
        // looking for the code by the user ID
        const codeFromDB = await ConfirmationCodeModel.findOne({
            userId: user._id,
        });
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
        user.password = hashPassword;
        await user.save();
        // deleting the code from the DB
        await codeFromDB.deleteOne();

        return { message: 'Password was changed' };
    }
}
