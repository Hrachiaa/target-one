import { UserEntity } from "../../../../domain/user/models/UserEntity";
import { UserRepositoryInterface } from "../../../../domain/user/UserRepository";
import ApiError from "../../../../domain/utils/errors/ApiError";
import { prisma } from "../prisma";
import { mapper } from "./UserMapper";

export interface UserDocument {
    id: string;
    email: string;
    emailVerified: boolean;
    googleId: string | null;
    password: string | null;
    balance: number;
    avatar: string;
} 


export class PostrgresUserRepository implements UserRepositoryInterface {
    async findUserByEmail(email: string): Promise <UserEntity | null>{
        const user: UserDocument | null = await prisma.user.findUnique({where: {email}})
        if (!user) return null
            return mapper.toEntity(user)
    }

    async findUserByGoogleId (googleId: string){
        const user: UserDocument | null = await prisma.user.findFirst({where: {googleId}})
    if (!user) return null
        return mapper.toEntity(user)    
    }

    async findUserWithEmail (email: string, googleId: null = null ){
        const user: UserDocument | null = await prisma.user.findUnique({where: {email, googleId}})
        if (!user) return null
        return mapper.toEntity(user)
    }

    async findById(userId: string){
        const user: UserDocument | null = await prisma.user.findUnique({where: {id: userId}})
        if (!user) throw ApiError.badRequest('User not found')
        return mapper.toEntity(user)
    }

    async createUserWithEmail(email: string, password: string){
        const user: UserDocument = await prisma.user.create({data: {email, password}})
        return mapper.toEntity(user)
    }

    async createUserWithGoogleId(googleId: string, email: string){
        const user: UserDocument = await prisma.user.create({data: {googleId, email, emailVerified: true}})
        return mapper.toEntity(user)
    }

    async verifyUserWithEmail(userId: string, googleId: string){
        const user: UserDocument | null = await prisma.user.update({
            where: {id: userId}, data: {googleId, emailVerified: true}})
        if (!user) throw ApiError.badRequest('User not found')
        return mapper.toEntity(user)
    }

    async setAvatar (userId: string, avatar: string){
        const user: UserDocument | null = await prisma.user.update({
            where: {id: userId}, data: {avatar}})
        if (!user) throw ApiError.badRequest('User not found')
        return mapper.toEntity(user)
    }

    async changePassword(userId: string, password: string){
        const user: UserDocument | null = await prisma.user.update({
            where: {id: userId}, data: {password}})
        if (!user) throw ApiError.badRequest('User not found')
        return mapper.toEntity(user)
    }

    async verifyEmail(userId: string){
        const user: UserDocument | null = await prisma.user.update({
            where: {id: userId}, data: {emailVerified: true}})
        if (!user) throw ApiError.badRequest('User not found')
        return mapper.toEntity(user)
    }

    async changeBalance(userId: string, amount: number) {
        const user: UserDocument | null = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                balance: {
                    increment: amount
                }
            }
    });
        if(!user) throw ApiError.serverError('Balance was not changed')
            return mapper.toEntity(user)
    }

    async deleteUser(userId: string){
        const user: UserDocument | null = await prisma.user.delete({where: {id: userId}})
        if(!user) return null
        return mapper.toEntity(user)
    }
}

    