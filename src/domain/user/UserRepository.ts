import { UserEntity } from "./models/UserEntity";

export interface UserRepositoryInterface {
    findUserByEmail(email: string): Promise <UserEntity | null>;
    findUserByGoogleId(googleId: string): Promise <UserEntity | null>;
    findUserWithEmail(email: string, googleId: null): Promise <UserEntity | null>
    findById(userId: string): Promise<UserEntity>;
    createUserWithEmail(email: string, password: string): Promise<UserEntity>;
    createUserWithGoogleId(googleId: string, email: string): Promise<UserEntity>;
    verifyUserWithEmail(userId: string, googleId: string): Promise<UserEntity>;
    setAvatar(userId: string, avatar: string): Promise<UserEntity>;
    changePassword(userId: string, password: string): Promise<UserEntity>;
    verifyEmail(userId: string): Promise<UserEntity>;
    deleteUser(userId: string): Promise<UserEntity | null>;
    changeBalance(userId: string, amount: number): Promise<UserEntity>
}