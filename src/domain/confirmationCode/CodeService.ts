import { MongoCodeRepository } from "../../infrastructure/db/mongoDB/confirmationCode/MongoCodeRepository";
import { CodeRepositoryInterface } from "./CodeRepository";
import { CodeEntity } from "./models/CodeEntity";

export class CodeService {
    constructor(readonly codeRepo: CodeRepositoryInterface){}
    async findCodeByUserId (userId: string): Promise <CodeEntity | null>{
        return await this.codeRepo.findConfirmatioanCode(userId)
    }

    async updateCodeById (codeId: string, code: string): Promise <CodeEntity>{
        return await this.codeRepo.updateConfirmationCode(codeId, code)
    }

    async createCode (userId: string, code: string): Promise <CodeEntity | null>{
        return await this.codeRepo.createConfirmationCode(userId, code)
    }

    async deleteCode (codeId: string): Promise <void>{
        return await this.codeRepo.deleteCode(codeId)
    }
}