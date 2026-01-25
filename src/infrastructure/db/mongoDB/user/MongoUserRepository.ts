import ApiError from "../../../../domain/utils/errors/ApiError";
import { UserRepositoryInterface } from "../../../../domain/user/UserRepository";
import { mapper } from "./UserMapper";
import UserModel, { UserDocument } from "./UserModel";

export class MongoUserRepository implements UserRepositoryInterface {
    async findUserByEmail (email: string){
        const user: UserDocument | null = await UserModel.findOne({email})
        if (!user) return null
        return mapper.toEntity(user)
    }

    async findUserByGoogleId (googleId: string){
        const user: UserDocument | null = await UserModel.findOne({googleId})
        if (!user) return null
        return mapper.toEntity(user)    
    }

    async findUserWithEmail (email: string, googleId: null = null ){
        const user: UserDocument | null = await UserModel.findOne({email, googleId})
        if (!user) return null
        return mapper.toEntity(user)
    }

    async findById(userId: string){
        const user: UserDocument | null = await UserModel.findById(userId)
        if (!user) throw ApiError.badRequest('User not found')
        return mapper.toEntity(user)
    }

    async createUserWithEmail(email: string, password: string){
        const user: UserDocument = await UserModel.create({email, password})
        return mapper.toEntity(user)
    }

    async createUserWithGoogleId(googleId: string, email: string){
        const user: UserDocument = await UserModel.create({googleId, email, emailVerified: true})
        return mapper.toEntity(user)
    }

    async verifyUserWithEmail(userId: string, googleId: string){
        const user: UserDocument | null = await UserModel.findByIdAndUpdate(userId, {googleId, emailVerified: true}, {new: true})
        if (!user) throw ApiError.badRequest('User not found')
        return mapper.toEntity(user)
    }

    async setAvatar (userId: string, avatar: string){
        const user: UserDocument | null = await UserModel.findByIdAndUpdate(userId, {avatar}, {new: true})
        if (!user) throw ApiError.badRequest('User not found')
        return mapper.toEntity(user)
    }

    async changePassword(userId: string, password: string){
        const user: UserDocument | null = await UserModel.findByIdAndUpdate(userId, {password}, {new: true})
        if (!user) throw ApiError.badRequest('User not found')
        return mapper.toEntity(user)
    }

    async verifyEmail(userId: string){
        const user: UserDocument | null = await UserModel.findByIdAndUpdate(userId, {emailVerified: true}, {new: true})
        if (!user) throw ApiError.badRequest('User not found')
        return mapper.toEntity(user)
    }

    async deleteUser(userId: string){
        const user: UserDocument | null = await UserModel.findByIdAndDelete(userId)
        if(!user) return null
        return mapper.toEntity(user)
    }

    async changeBalance(userId: string, amount: number) {
        const user: UserDocument | null = await UserModel.findByIdAndUpdate(
            userId,
            { $inc: { balance: amount } },
            { new: true }
        );
        if(!user) throw ApiError.serverError('Balance was not changed')
        return mapper.toEntity(user)
    }
}