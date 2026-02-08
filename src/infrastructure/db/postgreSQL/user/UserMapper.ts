import { UserEntity } from "../../../../domain/user/models/UserEntity";
import { UserDocument } from "./PostgresUserRepository";

interface DBMapper<T> {
    toEntity(UserDocument: UserDocument): UserEntity;
    toDB(UserEntity: UserEntity): T
}

class UserMapper implements DBMapper<undefined> {
    toEntity(user: UserDocument): UserEntity{
        return new UserEntity(String(user.id), user.email, user.emailVerified, user.googleId, user.password, user.balance, user.avatar)
    }
    toDB(user: UserEntity): undefined{
        return
    }
}

export const mapper = new UserMapper()