import ApiError from '../utils/errors/ApiError';
import UserDto from '../user/dtos/UserDto';
import { fastify, userService } from '../../server';
import bcrypt from 'bcryptjs';
import { TokenRepositoryInterface } from './TokenRepository';
import { Tokens, TokensDto } from './dtos/TokensDto';
import { TokenEntity } from './models/TokenEntity';
import { UserEntity } from '../user/models/UserEntity';

interface Message {
    message: string
}

export class TokenService {
    constructor(readonly tokenRepo: TokenRepositoryInterface) {}
    async tokenService(user: UserEntity): Promise<TokensDto> {
        // creating objectDTO of user
        const userDto: UserDto = new UserDto(user);
        // genereting the jwt tokens
        const tokens: Tokens = this.generateTokens({ ...userDto });
        // hashing the token
        const hashToken: string = await bcrypt.hash(tokens.refreshToken, 8);
        // saving the refresh token to the DB
        await this.saveToken(userDto.id, hashToken);
        return {
            user: userDto,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }

    generateTokens(payload: UserDto): Tokens {
        // payload is DTO of user
        // generation of tokens
        const accessToken: string = fastify.jwt.accessJwt.sign(payload, {
            expiresIn: '15m',
        });
        const refreshToken: string = fastify.jwt.refreshJwt.sign(payload, {
            expiresIn: '14d',
        });
        return { accessToken, refreshToken };
    }

    validateRefreshToken(refreshToken: string): UserDto | null {
        try {
            // checking if token is valid
            const userData: UserDto = fastify.jwt.refreshJwt.verify(refreshToken);
            return userData;
        } catch (error) {
            return null;
        }
    }

    async saveToken(userId: string, hashToken: string): Promise <TokenEntity> {
        // checking the DB for the token, changing on new one if there is
        const tokenData: TokenEntity | null = await this.tokenRepo.findTokenByUser(userId);
        if (tokenData) {
            return await this.tokenRepo.saveToken(tokenData.id, hashToken)
        }
        // Creating new one if there wasnt
        const token: TokenEntity = await this.tokenRepo.createToken(String(userId), hashToken)
        return token;
    }

    async findToken(refreshToken: string): Promise<TokenEntity> {
        try {
            // decoding the jwt token to get userDto to have id of user
            const userDto: UserDto | null =
                fastify.jwt.refreshJwt.decode(refreshToken);
            if (!userDto) {
                throw ApiError.unauthorizedError();
            }
            // trying to find the token it the DB by user id from which we got from userDto
            const token: TokenEntity | null = await this.tokenRepo.findTokenByUser(userDto.id);
            if (!token) {
                throw ApiError.unauthorizedError();
            }
            // checking if the refreshToken and the hashedToken from the DB are the same
            const isTrue: boolean = await bcrypt.compare(
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

    async removeToken(refreshToken: string): Promise <Message> {
        // decoding the jwt token to get userDto to have id of user
        const userDto: UserDto | null =
            fastify.jwt.refreshJwt.decode(refreshToken);
        if (!userDto) {
            throw ApiError.unauthorizedError();
        }
        // trying to find the token in the DB by user id from which we got from userDto
        const token: TokenEntity | null = await this.tokenRepo.findTokenByUser(userDto.id);
        if (!token) {
            throw ApiError.unauthorizedError();
        }
        // checking if the refreshToken and the hashedToken from the DB are the same
        const isTrue: boolean = await bcrypt.compare(refreshToken, token.refreshToken);
        if (!isTrue) {
            throw ApiError.unauthorizedError();
        }
        // deleting the refreshToken from DB by user id
        await this.tokenRepo.deleteToken(userDto.id);
        return { message: 'Token was deleted' };
    }

    async removeTokenById(userId: string): Promise<void> {
        await this.tokenRepo.deleteToken(userId);
    }

    async logout(refreshToken: string | undefined): Promise<Message> {
        if (!refreshToken) {
            throw ApiError.unauthorizedError();
        }
        return await this.removeToken(refreshToken);
    }

    async refresh(refreshToken: string | undefined): Promise<TokensDto> {
        // checking the token for existence
        if (!refreshToken) {
            throw ApiError.unauthorizedError();
        }
        // checking if the token is valid and exists in the DB
        const userData: UserDto | null = this.validateRefreshToken(refreshToken);
        const tokenFromDB: TokenEntity = await this.findToken(refreshToken);
        if (!userData || !tokenFromDB) {
            throw ApiError.unauthorizedError();
        }
        // creating DTO of the user, generating the tokens, hashing the refresh token,
        // saving the hash of the token to the DB, returning the user data and tokens
        const user: UserEntity = await userService.findById(userData.id);
        const tokens: TokensDto = await this.tokenService(user);
        return tokens;
    }
}
