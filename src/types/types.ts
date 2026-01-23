import UserDto from "../domain/user/dtos/UserDto";

export interface AuthData {
    user: UserDto;
    accessToken: string;
    refreshToken: string;
}