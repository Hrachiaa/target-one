import { TokenEntity } from "../../../../domain/token/models/TokenEntity"
import { TokenRepositoryInterface } from "../../../../domain/token/TokenRepository";
import ApiError from "../../../../domain/utils/errors/ApiError";
import { prisma } from "../prisma"
import { mapper } from "./TokenMapper";

export interface TokenDocument {
    id: string;
    userId: string;
    refreshToken: string;
    createdAt: NativeDate;
}

export class PostgresTokenRepository implements TokenRepositoryInterface {
    async createToken (userId: string, refreshToken: string){
        const tokenDocument = await prisma.token.create({data: {userId, refreshToken}})
        const tokenEntity: TokenEntity = mapper.toEntity(tokenDocument)
        return tokenEntity
    }

    async findTokenByUser (userId: string){
        const tokenDocument: TokenDocument | null = await prisma.token.findUnique({where: {userId}})
        if(!tokenDocument) return null
        const tokenEntity: TokenEntity = mapper.toEntity(tokenDocument)
        return tokenEntity
    }

    async saveToken (tokenId: string, refreshToken: string){
        const tokenDocument: TokenDocument | null= await prisma.token.update({where:{id: tokenId}, data: {refreshToken}})
        if(!tokenDocument) throw ApiError.serverError('Token is not updated')
        const tokenEntity: TokenEntity = mapper.toEntity(tokenDocument)
        return tokenEntity
    }

    async deleteToken (userId: string){
        await prisma.token.delete({where: {userId: userId}})
        return
    }
}