import { FastifyRequest, FastifyReply } from 'fastify';
import PlanService from '../../../../domain/plan/PlanService';

export class PlanController {
    constructor(readonly planService: PlanService){}
    async create(
        request: FastifyRequest<{ Body: { goal: string }; userId: string }>,
        reply: FastifyReply
    ) {
        const userId = request.userId!;
        const { goal } = request.body;
        this.planService.createPlan(userId, goal);
        const questions = await this.planService.createQuestions(userId, goal);
        return reply.send(questions);
    }

    async getUserPlans(
        request: FastifyRequest<{ Body: {}; userId: string }>,
        reply: FastifyReply
    ) {
        const userId = request.userId!;
        return reply.send(await this.planService.getUserPlans(userId));
    }

    async completePlanTask(
        request: FastifyRequest<{ Body: { taskId: string }; userId: string }>,
        reply: FastifyReply
    ) {
        const userId = request.userId!;
        const { taskId } = request.body;
        const updatedTask = await this.planService.completePlanTask(userId, taskId);
        return reply.send(updatedTask);
    }

    async uncompletePlanTask(
        request: FastifyRequest<{ Body: { taskId: string }; userId: string }>,
        reply: FastifyReply
    ) {
        const userId = request.userId!;
        const { taskId } = request.body;
        const updatedTask = await this.planService.uncompletePlanTask(
            userId,
            taskId
        );
        return reply.send(updatedTask);
    }

    async deletePlan(
        request: FastifyRequest<{ Body: { planId: string }; userId: string }>,
        reply: FastifyReply
    ) {
        const userId = request.userId!;
        const { planId } = request.body;
        const deleteOne = await this.planService.removeGoal(userId, planId);

        return reply.send(deleteOne);
    }
}
