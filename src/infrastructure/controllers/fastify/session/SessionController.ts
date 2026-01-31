import { FastifyRequest, FastifyReply } from 'fastify';
import { TokenService } from '../../../../domain/token/TokenService';


export default class {
    constructor(readonly tokenService: TokenService){}
    async logout(
        request: FastifyRequest<{ Body: { refreshToken: string } }>,
        reply: FastifyReply
    ) {
        const { refreshToken } = request.body;
        const token = await this.tokenService.logout(refreshToken);
        return reply.send(token);
    }

    async refresh(
        request: FastifyRequest<{ Body: { refreshToken: string } }>,
        reply: FastifyReply
    ) {
        const { refreshToken } = request.body;
        const tokens = await this.tokenService.refresh(refreshToken);
        return reply.send(tokens);
    }

    async authentication(request: FastifyRequest, reply: FastifyReply) {
        const payload = await request.accessJwtVerify<{ id: string }>();
        return (request.userId = payload.id);
    }
}
