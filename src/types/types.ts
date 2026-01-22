import UserDto from "../dtos/UserDto";

export interface AuthData {
    user: UserDto;
    accessToken: string;
    refreshToken: string;
}