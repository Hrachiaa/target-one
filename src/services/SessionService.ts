import ApiError from '../core/errors/ApiError';
import UserModel from '../models/UserModel';
import NotificationService from './NotificationService';
import TokenService from './TokenService';

export default class SessionService {
    static async logout(userId: string) {
        const token = await TokenService.removeTokenById(userId);
        await NotificationService.deleteDeviceToken(userId);
        return token;
    }

    static async refresh(refreshToken: string | undefined) {
        // checking the token for existence
        if (!refreshToken) {
            throw ApiError.unauthorizedError();
        }
        // checking if the token is valid and exists in the DB
        const userData: any = TokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = await TokenService.findToken(refreshToken);
        if (!userData || !tokenFromDB) {
            throw ApiError.unauthorizedError();
        }
        // creating DTO of the user, generating the tokens, hashing the refresh token,
        // saving the hash of the token to the DB, returning the user data and tokens
        const user = await UserModel.findById(userData.id);
        const tokens = await TokenService.tokenService(user);
        return tokens;
    }
}
