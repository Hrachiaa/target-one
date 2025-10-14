import { FastifyReply, FastifyRequest } from 'fastify';
import BalanceService from '../services/BalanceService';

export default class BalanceController {
    static async getBalance(
        request: FastifyRequest<{ Body: {}; userId: string }>,
        reply: FastifyReply
    ) {
        const userId = request.userId!;
        const balance = await BalanceService.getBalance(userId);
        return balance;
    }
}
