import { TokenEntity } from "./models/TokenEntity";

export interface TokenRepositoryInterface {
    createToken (userId: string, refreshToken: string): Promise<TokenEntity>;
    findTokenByUser (userId: string): Promise<TokenEntity | null>;
    saveToken (tokenId: string, refreshToken: string): Promise<TokenEntity>;
    deleteToken (userId: string): Promise<void>;
}