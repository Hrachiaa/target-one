import { Types } from 'mongoose';
import DEFAULT_ACHIEVEMENTS from '../config/defaultAchievements';
import AchievementModel from '../models/AchievementModel';
import BalanceService from './BalanceService';
import ApiError from '../core/errors/ApiError';

export default class AchievementService {
    static async createDefaultAchievments(userId: string) {
        const doc = await AchievementModel.findOne({ userId });

        if (!doc) {
            const created = await AchievementModel.create({
                userId,
                achievments: DEFAULT_ACHIEVEMENTS,
            });
            return created;
        }
        return;
        // TODO: later — check for missing achievements and add them if document exists
    }

    static async getAchievments(userId: string) {
        const achievements = await AchievementModel.findOne({ userId });
        if (!achievements) {
            throw ApiError.badRequest('Achievments not found');
        }
        return achievements;
    }

    static async unlockUchievment(userId: string, achievmentId: string) {
        const achievements = await AchievementService.getAchievments(userId);
        const achiev = achievements.achievments.find(
            (a: any) => a._id.toString() === achievmentId
        );
        if (!achiev) {
            throw ApiError.badRequest('Achievement not found');
        }
        const balance = await BalanceService.getBalance(userId);

        if (achiev.price > balance.balance) {
            throw ApiError.badRequest('User has no enough balance');
        }

        const updated = await AchievementModel.findOneAndUpdate(
            {
                userId,
                achievments: {
                    $elemMatch: {
                        _id: new Types.ObjectId(achievmentId),
                        isUnlocked: false,
                    },
                },
            },
            {
                $set: { 'achievments.$[inner].isUnlocked': true },
                $inc: { balance: -achiev.price },
            },
            {
                arrayFilters: [
                    { 'inner._id': new Types.ObjectId(achievmentId) },
                ],
                new: true,
            }
        );
        if (!updated) {
            throw ApiError.badRequest('Achievment is already mark as unlocked');
        }

        return updated;
    }
}
