import { CodeEntity } from "../../../../domain/confirmationCode/models/CodeEntity";
import { CodeDocument } from "./CodeModel";

interface DBMapper<T> {
    toEntity(codeDocument: CodeDocument): CodeEntity;
    toDB(codeEntity: CodeEntity): T
}

class CodeMapper implements DBMapper<undefined> {
    toEntity(confCode: CodeDocument): CodeEntity{
        return new CodeEntity(String(confCode._id), confCode.code)
    }
    toDB(code: CodeEntity): undefined{
        return
    }
}

export const mapper = new CodeMapper()