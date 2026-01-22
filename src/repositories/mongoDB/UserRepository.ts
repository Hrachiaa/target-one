import UserModel from "../../models/UserModel";
import { UserDocument } from "../../types/mongoDBDocuments";

export default class UserRepository {
    static async findUserByEmail (email: string){
        const user: UserDocument | null = await UserModel.findOne({email})
        return user
    }

    static async findUserByGoogleId (googleId: string){
        const user: UserDocument | null = await UserModel.findOne({googleId})
        return user
    }

    static async findUserWithEmail (email: string, googleId: null = null ){
        const user: UserDocument | null = await UserModel.findOne({email, googleId})
        return user
    }

    static async findById(userId: string){
        const user: UserDocument | null = await UserModel.findById(userId)
        return user
    }

    static async createUserWithEmail(email: string, password: string){
        const user: UserDocument = await UserModel.create({email, password})
        return user
    }

    static async createUserWithGoogleId(googleId: string, email: string){
        const user: UserDocument = await UserModel.create({googleId, email, emailVerified: true})
        return user
    }

    static async verifyUserWithEmail(userId: string, googleId: string){
        const user: UserDocument | null = await UserModel.findByIdAndUpdate(userId, {googleId, emailVerified: true})
        return user
    }

    static async setAvatar (userId: string, avatar: string){
        const user: UserDocument | null = await UserModel.findByIdAndUpdate(userId, {avatar})
        return user
    }

    static async changePassword(userId: string, password: string){
        const user: UserDocument | null = await UserModel.findByIdAndUpdate(userId, {password})
        return user
    }

    static async verifyEmail(userId: string){
        const user: UserDocument | null = await UserModel.findByIdAndUpdate(userId, {emailVerified: true})
        return user
    }

    static async deleteUser(userId: string){
        const user: UserDocument | null = await UserModel.findByIdAndDelete(userId)
        return user
    }
}