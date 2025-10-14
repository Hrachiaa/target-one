import ApiError from '../core/errors/ApiError';
import AchievementModel from '../models/AchievementModel';

export default class BalanceService {
    static async getBalance(userId: string) {
        const achievements = await AchievementModel.findOne({ userId });
        if (!achievements) {
            throw ApiError.serverError('Server could not get balance');
        }
        return { balance: achievements.balance };
    }

    static async increaseBalance(userId: string, amount: number) {
        const updated = await AchievementModel.findOneAndUpdate(
            { userId },
            { $inc: { balance: amount } },
            { new: true }
        );
        return updated;
    }

    static async decreaseBalance(userId: string, amount: number) {
        const updated = await AchievementModel.findOneAndUpdate(
            { userId },
            { $inc: { balance: -amount } },
            { new: true }
        );
        return updated;
    }
}
