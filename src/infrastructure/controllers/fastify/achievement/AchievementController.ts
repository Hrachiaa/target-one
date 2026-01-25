import { FastifyReply, FastifyRequest } from 'fastify';
import AchievementService from '../../../../domain/achievement/AchievementService';

export default class AchievementController {
    constructor(readonly achievementService: AchievementService){}
    async getAchievments(
        request: FastifyRequest<{ Body: {}; userId: string }>,
        reply: FastifyReply
    ) {
        const userId = request.userId!;
        const achievements = await this.achievementService.getAchievements(userId);
        return reply.send(achievements);
    }

    async unlockUchievment(
        request: FastifyRequest<{
            Body: { achievementId: string };
            userId: string;
        }>,
        reply: FastifyReply
    ) {
        const userId = request.userId!;
        const { achievementId } = request.body;
        const unlock = await this.achievementService.unlockUchievment(
            userId,
            achievementId
        );
        return reply.send(unlock);
    }

    async setAvatar(
        request: FastifyRequest<{
            Body: { achievementId: string };
            userId: string;
        }>,
        reply: FastifyReply
    ) {
        const userId = request.userId!;
        const { achievementId } = request.body;
        const setAvatar = await this.achievementService.setAvatar(
            userId,
            achievementId
        );
        return reply.send(setAvatar);
    }
}
