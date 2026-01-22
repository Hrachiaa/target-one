import ConfirmationCodeModel from "../../models/ConfirmationCodeModel";

export default class ConfirmationCodeRepository {
    static async createConfirmationCode (userId: string, code: string){
        return await ConfirmationCodeModel.create({userId, code})
    }

    static async findConfirmatioanCode(userId: string){
        return await ConfirmationCodeModel.findOne({userId})
    }

    static async updateConfirmationCode(codeId: string, code: string){
        return await ConfirmationCodeModel.findByIdAndUpdate(codeId, {code, createdAt: new Date()})
    }
}