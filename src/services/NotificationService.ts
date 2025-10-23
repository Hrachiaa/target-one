import ApiError from '../core/errors/ApiError';
import UserModel from '../models/UserModel';

export default class NotificationService {
    static async saveDeviceToken(deviceToken: string, userId: string) {
        const user = await UserModel.findByIdAndUpdate(
            userId,
            { deviceToken },
            { new: true }
        );
        if (!user) {
            throw ApiError.badRequest('User not found');
        }
        return user;
    }

    static async deleteDeviceToken(userId: string) {
        const user = await UserModel.findByIdAndUpdate(
            userId,
            { deviceToken: null },
            { new: true }
        );

        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}
