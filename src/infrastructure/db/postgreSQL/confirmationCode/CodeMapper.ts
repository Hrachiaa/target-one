import { CodeEntity } from "../../../../domain/confirmationCode/models/CodeEntity";
import { CodeDocument } from "./PostgresCodeRepository";

interface DBMapper<T> {
    toEntity(CodeDocument: CodeDocument): CodeEntity;
    toDB(CodeEntity: CodeEntity): T
}

class CodeMapper implements DBMapper<undefined> {
    toEntity(confCode: CodeDocument): CodeEntity{
        return new CodeEntity(confCode.id, confCode.code)
    }
    toDB(code: CodeEntity): undefined{
        return
    }
}

export const mapper = new CodeMapper()