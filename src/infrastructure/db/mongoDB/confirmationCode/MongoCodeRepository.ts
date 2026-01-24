import ApiError from "../../../../core/errors/ApiError";
import { CodeRepositoryInterface } from "../../../../domain/confirmationCode/CodeRepository";
import { mapper } from "./CodeMapper";
import ConfirmationCodeModel, { CodeDocument } from "./CodeModel";

export class ConfirmationCodeRepository implements CodeRepositoryInterface {
    async createConfirmationCode (userId: string, code: string){
        const doc: CodeDocument = await ConfirmationCodeModel.create({userId, code})
        const codeEntity = mapper.toEntity(doc)
        return codeEntity
    }

    async findConfirmatioanCode(userId: string){
        const doc: CodeDocument | null = await ConfirmationCodeModel.findOne({userId})
        if(!doc) return null
        const codeEntity = mapper.toEntity(doc)
        return codeEntity
    }

    async updateConfirmationCode(codeId: string, code: string){
        const doc: CodeDocument | null = await ConfirmationCodeModel.findByIdAndUpdate(codeId, {code, createdAt: new Date()}, {new: true})
        if(!doc) throw ApiError.badRequest('Some error')
        const codeEntity = mapper.toEntity(doc)
        return codeEntity
    }

    async deleteCode(codeId: string){
        const doc: CodeDocument | null = await ConfirmationCodeModel.findByIdAndDelete(codeId)
        return
    }
}