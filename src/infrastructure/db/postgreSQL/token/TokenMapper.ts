import { TokenEntity } from "../../../../domain/token/models/TokenEntity";
import { TokenDocument } from "./PostgresTokenRepository";

interface DBMapper<T> {
    toEntity(tokenDocument: TokenDocument): TokenEntity;
    toDB(tokenEntity: TokenEntity): T
}

class TokenMapper implements DBMapper<undefined> {
    toEntity(token: TokenDocument): TokenEntity{
        return new TokenEntity(String(token.id), token.refreshToken)
    }
    toDB(token: TokenEntity): undefined{
        return
    }
}

export const mapper = new TokenMapper()