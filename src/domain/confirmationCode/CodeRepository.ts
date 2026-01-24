import { CodeEntity } from "./models/CodeEntity";

export interface CodeRepositoryInterface {
    createConfirmationCode(userId: string, code: string): Promise<CodeEntity>
    findConfirmatioanCode(userId: string): Promise<CodeEntity | null>
    updateConfirmationCode(codeId: string, code: string): Promise<CodeEntity>
    deleteCode(codeId: string): void
}