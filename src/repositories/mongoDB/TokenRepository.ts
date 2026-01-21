import TokenModel from "../../models/TokenModel";

export default class TokenRepository {
    static async createToken (userId: string, refreshToken: string){
        return await TokenModel.create({userId, refreshToken})
    }

    static async findTokenByUser (userId: string){
        return await TokenModel.findOne({userId})
    }

    static async saveToken (tokenId: string, refreshToken: string){
        return await TokenModel.findByIdAndUpdate(tokenId, {refreshToken})
    }

    static async deleteToken (userId: string){
        return await TokenModel.findOneAndDelete({userId})
    }
}