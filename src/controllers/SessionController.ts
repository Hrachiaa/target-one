import { FastifyRequest, FastifyReply } from 'fastify';
import SessionService from '../services/SessionService';

export default class {
    static async logout(
        request: FastifyRequest<{ Body: { refreshToken: string } }>,
        reply: FastifyReply
    ) {
        const { refreshToken } = request.body;
        const token = await SessionService.logout(refreshToken);
        return reply.send(token);
    }

    static async refresh(
        request: FastifyRequest<{ Body: { refreshToken: string } }>,
        reply: FastifyReply
    ) {
        const { refreshToken } = request.body;
        const tokens = await SessionService.refresh(refreshToken);
        return reply.send(tokens);
    }

    static async authentication(request: FastifyRequest, reply: FastifyReply) {
        const payload = await request.accessJwtVerify<{ id: string }>();
        return (request.userId = payload.id);
    }
}
