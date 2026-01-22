import { Types } from "mongoose";
import DEFAULT_ACHIEVEMENTS from "../../config/defaultAchievements";
import AchievementModel from "../../models/AchievementModel";

export default class AchievementRepository {
    static async createAchievements(userId: string){
        return await AchievementModel.create({userId, achievements: DEFAULT_ACHIEVEMENTS})
    }

    static async findByUserId(userId: string){
        return await AchievementModel.findOne({userId})
    }
    
    static async findIfUnlocked(userId: string, achievementId: string){
        return await AchievementModel.findOne(
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
    }

    static async unlockAchievement(userId: string, achievementId: string, price: number){
        return await AchievementModel.findOneAndUpdate(
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
                $inc: { balance: -price },
            },
            {
                arrayFilters: [
                    { 'inner._id': new Types.ObjectId(achievementId) },
                ],
                new: true,
            }
        )
    }

    static async getBalance (userId: string){
        return await AchievementModel.findOne({userId})
    }

    static async changeBalance(userId: string, amount: number) {
            return await AchievementModel.findOneAndUpdate(
                { userId },
                { $inc: { balance: amount } },
                { new: true }
            );
        }

    static async deleteAll (userId: string){
        return await AchievementModel.findOneAndDelete({userId})
    }
}