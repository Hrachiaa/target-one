import ApiError from "../../../../domain/utils/errors/ApiError";
import { TokenEntity } from "../../../../domain/token/models/TokenEntity";
import { TokenRepositoryInterface } from "../../../../domain/token/TokenRepository";
import { mapper } from "./TokenMapper";
import TokenModel, { TokenDocument } from "./TokenModel";

export class MongoTokenRepository implements TokenRepositoryInterface {
    async createToken (userId: string, refreshToken: string){
        const tokenDocument: TokenDocument = await TokenModel.create({userId, refreshToken})
        const tokenEntity: TokenEntity = mapper.toEntity(tokenDocument)
        return tokenEntity
    }

    async findTokenByUser (userId: string){
        const tokenDocument: TokenDocument | null = await TokenModel.findOne({userId})
        if(!tokenDocument) return null
        const tokenEntity: TokenEntity = mapper.toEntity(tokenDocument)
        return tokenEntity
    }

    async saveToken (tokenId: string, refreshToken: string){
        const tokenDocument: TokenDocument | null= await TokenModel.findByIdAndUpdate(tokenId, {refreshToken}, {new: true})
        if(!tokenDocument) throw ApiError.serverError('Token is not updated')
        const tokenEntity: TokenEntity = mapper.toEntity(tokenDocument)
        return tokenEntity
    }

    async deleteToken (userId: string){
        await TokenModel.findOneAndDelete({userId})
        return
    }
}