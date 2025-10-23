import { FastifyReply, FastifyRequest } from 'fastify';
import NotificationService from '../services/NotificationService';

export default class NotificationController {
    static async saveDeviceToken(
        request: FastifyRequest<{
            Body: { deviceToken: string };
            userId: string;
        }>,
        reply: FastifyReply
    ) {
        const userId = request.userId!;
        const { deviceToken } = request.body;
        const saveToken = await NotificationService.saveDeviceToken(
            deviceToken,
            userId
        );

        return reply.send(saveToken);
    }

    static async deleteDeviceToken(
        request: FastifyRequest<{ Body: {}; userId: string }>,
        reply: FastifyReply
    ) {
        const userId = request.userId!;
        const deleteToken = await NotificationService.deleteDeviceToken(userId);

        return reply.send(deleteToken);
    }
}
