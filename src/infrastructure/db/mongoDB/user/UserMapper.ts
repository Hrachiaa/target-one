import { UserEntity } from "../../../../domain/user/models/UserEntity";
import { UserDocument } from "./UserModel";

interface DBMapper<T> {
    toEntity(UserDocument: UserDocument): UserEntity;
    toDB(UserEntity: UserEntity): T
}

export class UserMapper implements DBMapper<undefined> {
    toEntity(user: UserDocument): UserEntity{
        return new UserEntity(String(user._id), user.email, user.emailVerified, user.googleId = null, user.password = null, user.avatar)
    }
    toDB(user: UserEntity): undefined{
        return
    }
}