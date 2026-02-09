import { CodeEntity } from "../../../../domain/confirmationCode/models/CodeEntity";
import { CodeDocument } from "./PostgresCodeRepository";

interface DBMapper<T> {
    toEntity(UserDocument: CodeDocument): CodeEntity;
    toDB(UserEntity: CodeEntity): T
}

class CodeMapper implements DBMapper<undefined> {
    toEntity(confCode: CodeDocument): CodeEntity{
        return new CodeEntity(String(confCode.id), confCode.code)
    }
    toDB(user: CodeEntity): undefined{
        return
    }
}

export const mapper = new CodeMapper()