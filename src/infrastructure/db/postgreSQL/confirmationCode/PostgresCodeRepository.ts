import { CodeRepositoryInterface } from "../../../../domain/confirmationCode/CodeRepository";
import ApiError from "../../../../domain/utils/errors/ApiError";
import { prisma } from "../prisma";
import { mapper } from "./CodeMapper";

export interface CodeDocument {
        id: string;
        userId: string;
        code: string;
        createdAt: NativeDate;
}

export class PostgresCodeRepository implements CodeRepositoryInterface {
    async createConfirmationCode (userId: string, code: string){
        const doc: CodeDocument = await prisma.code.create({data: {userId, code}})
        const codeEntity = mapper.toEntity(doc)
        return codeEntity
    }

    async findConfirmatioanCode(userId: string){
        const doc: CodeDocument | null = await prisma.code.findUnique({where: {userId}})
        if(!doc) return null
        if(Date.now() - doc.createdAt.getTime() > 15 * 60 * 1000){
            await prisma.code.delete({where: {userId}})
            return null
        }
        const codeEntity = mapper.toEntity(doc)
        return codeEntity
    }

    async updateConfirmationCode(codeId: string, code: string){
        const doc: CodeDocument | null = await prisma.code.update({where: {id: codeId}, data: {code, createdAt: new Date()}})
        if(!doc) throw ApiError.badRequest('Some error')
        const codeEntity = mapper.toEntity(doc)
        return codeEntity
    }

    async deleteCode(codeId: string){
        const doc: CodeDocument | null = await prisma.code.delete({where: {id: codeId}})
        return
    }

}