import { FastifyRequest, FastifyReply } from 'fastify';
import GoalService from '../services/GoalService';

export default class GoalController {
    static async create(
        request: FastifyRequest<{ Body: { goal: string }; userId: string }>,
        reply: FastifyReply
    ) {
        const userId = request.userId!;
        const { goal } = request.body;
        GoalService.createPlan(userId, goal);
        const questions = await GoalService.createQuestions(userId, goal);
        return reply.send(questions);
    }

    static async getUserPlans(
        request: FastifyRequest<{ Body: {}; userId: string }>,
        reply: FastifyReply
    ) {
        const userId = request.userId!;
        return reply.send(await GoalService.getUserPlans(userId));
    }

    static async completePlanTask(
        request: FastifyRequest<{ Body: { taskId: string }; userId: string }>,
        reply: FastifyReply
    ) {
        const userId = request.userId!;
        const { taskId } = request.body;
        const updatedTask = await GoalService.completePlanTask(userId, taskId);
        return reply.send(updatedTask);
    }

    static async uncompletePlanTask(
        request: FastifyRequest<{ Body: { taskId: string }; userId: string }>,
        reply: FastifyReply
    ) {
        const userId = request.userId!;
        const { taskId } = request.body;
        const updatedTask = await GoalService.uncompletePlanTask(
            userId,
            taskId
        );
        return reply.send(updatedTask);
    }
}
