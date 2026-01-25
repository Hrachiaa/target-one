import ApiError from '../utils/errors/ApiError';
import { userService } from '../../server';
import { AchievementRepositoryInterface } from './AchievementRepository';

export default class AchievementService {
    constructor(readonly achievementRepo: AchievementRepositoryInterface){}
    async createDefaultAchievements(userId: string): Promise<void> {
        const doc = await this.achievementRepo.findByUserId(userId);

        if (!doc) {
            await this.achievementRepo.createAchievements(userId)
            return
        }
        return;
        // TODO: later — check for missing achievements and add them if document exists
    }

    async getAchievements(userId: string) {
        const achievements = await this.achievementRepo.findByUserId(userId);
        if (!achievements) {
            throw ApiError.badRequest('Achievements not found');
        }
        return achievements;
    }

    async unlockUchievment(userId: string, achievementId: string) {
        const achievements = await this.getAchievements(userId);
        const achiev = achievements.achievements.find(
            (a: any) => a._id.toString() === achievementId
        );
        if (!achiev) {
            throw ApiError.badRequest('Achievement not found');
        }
        const balance = await userService.getBalance(userId);

        if (achiev.price > balance.balance) {
            throw ApiError.badRequest('User has no enough balance');
        }

        const updated = await this.achievementRepo.unlockAchievement(userId, achievementId)
        await userService.decreaseBalance(userId, achiev.price)
        if (!updated) {
            throw ApiError.badRequest('Achievement is already mark as unlocked');
        }

        return updated;
    }

    async setAvatar(userId: string, achievementId: string) {
        const user = await userService.findById(userId);
        if (!user) {
            throw ApiError.serverError('User not found');
        }

        const achievement = await this.achievementRepo.findIfUnlocked(userId, achievementId)
        if (!achievement) {
            throw ApiError.badRequest('Achievement not unlocked');
        }

        const achievementLink = achievement.achievements[0].icon;

        return await userService.setAvatar(userId, achievementLink)
    }

    async removeAchievements(userId: string) {
        await this.achievementRepo.deleteAll(userId);
    }
}
