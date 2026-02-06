import { PrismaClient } from "../../../../generated/prisma/client";
import { prisma } from "../prisma";


export class PostrgresUserRepository {
    async findUserByEmail(email: string): Promise <UserEntity | null>{
        const userDoc = await prisma.user.findUnique({where: {email}})
        
    }
}