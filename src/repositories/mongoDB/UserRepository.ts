import UserModel from "../../models/UserModel";

export default class UserRepository {
    static async findUserByEmail (email: string){
        const user = await UserModel.findOne({email})
        return user
    }

    static async findUserByGoogleId (googleId: string){
        return await UserModel.findOne({googleId})
    }

    static async findUserWithEmail (email: string, googleId: null = null ){
        return await UserModel.findOne({email, googleId})
    }

    static async findById(id: string){
        return await UserModel.findById(id)
    }

    static async createUserWithEmail(email: string, password: string){
        return await UserModel.create({email, password})
    }

    static async createUserWithGoogleId(googleId: string, email: string){
        return await UserModel.create({googleId, email, emailVerified: true})
    }

    static async verifyUserWithEmail(userId: string, googleId: string){
        const user = await UserModel.findByIdAndUpdate(userId, {googleId, emailVerified: true})
        return user
    }

    static async setAvatar (userId: string, avatar: string){
        return await UserModel.findByIdAndUpdate(userId, {avatar})
    }
}