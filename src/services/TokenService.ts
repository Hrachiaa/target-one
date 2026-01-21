import ApiError from '../core/errors/ApiError';
import TokenRepository from '../repositories/mongoDB/TokenRepository';
import UserDto from '../dtos/UserDto';
import { fastify } from '../server';
import bcrypt from 'bcryptjs';

export default class TokenService {
    static async tokenService(user: any) {
        // creating objectDTO of user
        const userDto = new UserDto(user);
        // genereting the jwt tokens
        const tokens = TokenService.generateTokens({ ...userDto });
        // hashing the token
        const hashToken = await bcrypt.hash(tokens.refreshToken, 8);
        // saving the refresh token to the DB
        await TokenService.saveToken(userDto.id, hashToken);
        return {
            user: userDto,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }

    static generateTokens(payload: UserDto) {
        // payload is DTO of user
        // generation of tokens
        const accessToken = fastify.jwt.accessJwt.sign(payload, {
            expiresIn: '15m',
        });
        const refreshToken = fastify.jwt.refreshJwt.sign(payload, {
            expiresIn: '14d',
        });
        return { accessToken, refreshToken };
    }

    static validateRefreshToken(refreshToken: string) {
        try {
            // checking if token is valid
            const userData = fastify.jwt.refreshJwt.verify(refreshToken);
            return userData;
        } catch (error) {
            return null;
        }
    }

    static async saveToken(userId: any, hashToken: string) {
        // checking the DB for the token, changing on new one if there is
        const tokenData = await TokenRepository.findTokenByUser(userId);
        if (tokenData) {
            return await TokenRepository.saveToken(String(tokenData._id), hashToken)
        }
        // Creating new one if there wasnt
        const token = await TokenRepository.createToken(String(userId), hashToken)
        return token;
    }

    static async findToken(refreshToken: string) {
        try {
            // decoding the jwt token to get userDto to have id of user
            const tokenData: UserDto | null =
                fastify.jwt.refreshJwt.decode(refreshToken);
            if (!tokenData) {
                throw ApiError.unauthorizedError();
            }
            // trying to find the token it the DB by user id from which we got from userDto
            const token = await TokenRepository.findTokenByUser(tokenData.id);
            if (!token) {
                throw ApiError.unauthorizedError();
            }
            // checking if the refreshToken and the hashedToken from the DB are the same
            const isTrue = await bcrypt.compare(
                refreshToken,
                token.refreshToken
            );
            if (!isTrue) {
                throw ApiError.unauthorizedError();
            }
            // return found token
            return token;
        } catch (error) {
            throw ApiError.unauthorizedError();
        }
    }

    static async removeToken(refreshToken: string) {
        // decoding the jwt token to get userDto to have id of user
        const tokenData: UserDto | null =
            fastify.jwt.refreshJwt.decode(refreshToken);
        if (!tokenData) {
            throw ApiError.unauthorizedError();
        }
        // trying to find the token in the DB by user id from which we got from userDto
        const token = await TokenRepository.findTokenByUser(tokenData.id);
        if (!token) {
            throw ApiError.unauthorizedError();
        }
        // checking if the refreshToken and the hashedToken from the DB are the same
        const isTrue = await bcrypt.compare(refreshToken, token.refreshToken);
        if (!isTrue) {
            throw ApiError.unauthorizedError();
        }
        // deleting the refreshToken from DB by user id
        await TokenRepository.deleteToken(tokenData.id);
        return { messege: 'Token was deleted' };
    }

    static async removeTokenById(userId: string) {
        await TokenRepository.deleteToken(userId);
    }
}
