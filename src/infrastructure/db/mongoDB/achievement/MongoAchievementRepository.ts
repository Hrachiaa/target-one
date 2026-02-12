import { Types } from "mongoose";
import DEFAULT_ACHIEVEMENTS from "../../../../domain/achievement/utils/defaultAchievements";
import AchievementModel, { AchievementsDocument } from "./AchievementModel";
import { mapper } from "./AchievementMapper";
import { AchievementRepositoryInterface } from "../../../../domain/achievement/AchievementRepository";

export class MongoAchievementRepository implements AchievementRepositoryInterface{
    async createAchievements(userId: string){
        const achieves: AchievementsDocument = await AchievementModel.create({userId, achievements: DEFAULT_ACHIEVEMENTS})
        return mapper.toEntity(achieves)
    }

    async findByUserId(userId: string){
        const achieves: AchievementsDocument | null = await AchievementModel.findOne({userId})
        if(!achieves) return null 
        return mapper.toEntity(achieves)

    }
    
    async findIfUnlocked(userId: string, achievementId: string){
        const achieves: AchievementsDocument | null = await AchievementModel.findOne(
            {
                userId,
                achievements: {
                    $elemMatch: {
                        _id: new Types.ObjectId(achievementId),
                        isUnlocked: true,
                    },
                },
            },
            {
                'achievements.$': 1,
            }
        );
        if(!achieves) return null 

        const item = achieves.achievements
            .flat()
            .find(t => t._id.toString() === achievementId);

        if (!item) return null;

        return mapper.toItemEntity(item)
    }

    async unlockAchievement(userId: string, achievementId: string){
        const achieves: AchievementsDocument | null = await AchievementModel.findOneAndUpdate(
            {
                userId,
                achievements: {
                    $elemMatch: {
                        _id: new Types.ObjectId(achievementId),
                        isUnlocked: false,
                    },
                },
            },
            {
                $set: { 'achievements.$[inner].isUnlocked': true },
            },
            {
                arrayFilters: [
                    { 'inner._id': new Types.ObjectId(achievementId) },
                ],
                new: true,
            }
        )
        if(!achieves) return null 

        const item = achieves.achievements
            .flat()
            .find(t => t._id.toString() === achievementId);

        if (!item) return null;

        return mapper.toItemEntity(item)

    }

    async deleteAll (userId: string){
        await AchievementModel.findOneAndDelete({userId})
        return
    }
}