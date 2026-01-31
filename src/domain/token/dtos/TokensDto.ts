import UserDto from "../../user/dtos/UserDto";
export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export interface TokensDto extends Tokens{
    user: UserDto;
}