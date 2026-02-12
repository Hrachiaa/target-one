import { AchievementRepositoryInterface } from "../../../../domain/achievement/AchievementRepository";
import { AchievementsEntity } from "../../../../domain/achievement/models/AchievementEntity";
import DEFAULT_ACHIEVEMENTS from "../../../../domain/achievement/utils/defaultAchievements";
import { prisma } from "../prisma";
import { mapper } from "./AchievementMapper";

export interface AchievementItemDocument {
    id: string;
    achievementName: string;
    icon: string;
    price: number;
    isUnlocked: boolean;
    achievementsId: string;
}

export interface AchievementsDocument {
    id: string;
    userId: string;
    achievements: AchievementItemDocument[]
}

export class PostgresAchievementRepository implements AchievementRepositoryInterface {
    async createAchievements(userId: string): Promise <AchievementsEntity>{
        const achieves: AchievementsDocument = await prisma.achievements.create({
            data: {userId, achievements: {
                create: DEFAULT_ACHIEVEMENTS.map((item)=>({
                    achievementName: item.achievementName,
                    icon: item.icon,
                    price: item.price
                })),
            }},
            include: {achievements: true}
        })
        return mapper.toEntity(achieves)
    }

    async findByUserId(userId: string){
        const achieves: AchievementsDocument | null = await prisma.achievements.findUnique({
            where: {userId}, 
            include: {achievements: true}
        })
        if(!achieves) return null 
        return mapper.toEntity(achieves)
    }

    async findIfUnlocked(userId: string, achievementId: string){
        const achieves: AchievementItemDocument | null = await prisma.achievementItem.findUnique({where: {id: achievementId, isUnlocked: true}});
        if(!achieves) return null 
        return mapper.toItemEntity(achieves)
    }

    async unlockAchievement(userId: string, achievementId: string){
        const achieves: AchievementItemDocument | null = await prisma.achievementItem.update({
            where: {id: achievementId},
            data: {isUnlocked: true}
        })
        if(!achieves) return null 
        return mapper.toItemEntity(achieves)
    }

    async deleteAll (userId: string){
        await prisma.achievements.deleteMany({where: {userId}})
        return
    }
}