import { FastifyReply, FastifyRequest } from 'fastify';
import AchievementService from '../services/AchievementService';

export default class AchievementController {
    static async getAchievments(
        request: FastifyRequest<{ Body: {}; userId: string }>,
        reply: FastifyReply
    ) {
        const userId = request.userId!;
        const achievements = await AchievementService.getAchievements(userId);
        return reply.send(achievements);
    }

    static async unlockUchievment(
        request: FastifyRequest<{
            Body: { achievementId: string };
            userId: string;
        }>,
        reply: FastifyReply
    ) {
        const userId = request.userId!;
        const { achievementId } = request.body;
        const unlock = await AchievementService.unlockUchievment(
            userId,
            achievementId
        );
        return reply.send(unlock);
    }

    static async setAvatar(
        request: FastifyRequest<{
            Body: { achievementId: string };
            userId: string;
        }>,
        reply: FastifyReply
    ) {
        const userId = request.userId!;
        const { achievementId } = request.body;
        const setAvatar = await AchievementService.setAvatar(
            userId,
            achievementId
        );
        return reply.send(setAvatar);
    }
}
