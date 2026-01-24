import { ConfirmationCodeRepository } from "../../infrastructure/db/mongoDB/confirmationCode/MongoCodeRepository";
import { MongoUserRepository } from "../../infrastructure/db/mongoDB/user/MongoUserRepository";
import { CodeRepositoryInterface } from "./CodeRepository";

class CodeService {
    constructor(readonly codeRepo: CodeRepositoryInterface){}
    async findCodeByUserId (userId: string){
        return await this.codeRepo.findConfirmatioanCode(userId)
    }

    async updateCodeById (codeId: string, code: string){
        return await this.codeRepo.updateConfirmationCode(codeId, code)
    }

    async createCode (userId: string, code: string){
        return await this.codeRepo.createConfirmationCode(userId, code)
    }

    async deleteCode (codeId: string){
        return await this.codeRepo.deleteCode(codeId)
    }
}

const codeRepo = new ConfirmationCodeRepository()
export const codeService = new CodeService(codeRepo)