import BalanceService from './BalanceService';
import ApiError from '../core/errors/ApiError';
import {MongoUserRepository} from '../infrastructure/db/mongoDB/user/MongoUserRepository';
import AchievementRepository from '../repositories/mongoDB/AchievementRepository';

const mongoUserRepository = new MongoUserRepository()

export default class AchievementService {
    static async createDefaultAchievements(userId: string): Promise<undefined> {
        const doc = await AchievementRepository.findByUserId(userId);

        if (!doc) {
            await AchievementRepository.createAchievements(userId)
            return
        }
        return;
        // TODO: later — check for missing achievements and add them if document exists
    }

    static async getAchievements(userId: string) {
        const achievements = await AchievementRepository.findByUserId(userId);
        if (!achievements) {
            throw ApiError.badRequest('Achievements not found');
        }
        return achievements;
    }

    static async unlockUchievment(userId: string, achievementId: string) {
        const achievements = await AchievementService.getAchievements(userId);
        const achiev = achievements.achievements.find(
            (a: any) => a._id.toString() === achievementId
        );
        if (!achiev) {
            throw ApiError.badRequest('Achievement not found');
        }
        const balance = await BalanceService.getBalance(userId);

        if (achiev.price > balance.balance) {
            throw ApiError.badRequest('User has no enough balance');
        }

        const updated = await AchievementRepository.unlockAchievement(userId, achievementId, achiev.price)
        if (!updated) {
            throw ApiError.badRequest('Achievement is already mark as unlocked');
        }

        return updated;
    }

    static async setAvatar(userId: string, achievementId: string) {
        const user = await mongoUserRepository.findById(userId);
        if (!user) {
            throw ApiError.serverError('User not found');
        }

        const achievement = await AchievementRepository.findIfUnlocked(userId, achievementId)
        if (!achievement) {
            throw ApiError.badRequest('Achievement not unlocked');
        }

        const achievementLink = achievement.achievements[0].icon;

        return await mongoUserRepository.setAvatar(userId, achievementLink)
    }

    static async removeAchievements(userId: string) {
        await AchievementRepository.deleteAll(userId);
    }
}
