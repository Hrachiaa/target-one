import ApiError from '../core/errors/ApiError';
import AchievementRepository from '../repositories/mongoDB/AchievementRepository';

export default class BalanceService {
    static async getBalance(userId: string) {
        const achievements = await AchievementRepository.findByUserId(userId);
        if (!achievements) {
            throw ApiError.serverError('Server could not get balance');
        }
        return { balance: achievements.balance };
    }

    static async increaseBalance(userId: string, amount: number) {
        const updated = await AchievementRepository.changeBalance(userId, amount);
        return updated;
    }

    static async decreaseBalance(userId: string, amount: number) {
        const updated = await AchievementRepository.changeBalance(userId, -amount);
        return updated;
    }
}
