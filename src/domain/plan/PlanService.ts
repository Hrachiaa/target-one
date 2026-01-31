import { zodTextFormat } from 'openai/helpers/zod';
import planPromt from './promts/planPromt';
import questionsPromt from './promts/questionsPromt';
import {client} from '../../infrastructure/config/openai';
import ApiError from '../utils/errors/ApiError';
import { questionsSchema, planSchema } from './schemas/planSchemas';
import { userService } from '../../server';
import { PlanRepositoryInterface } from './PlanRepository';
import { PlanEntity, QuestionsFromAI, TaskFromAI } from './models/PlanEntity';

export default class PlanService {
    constructor(readonly planRepo: PlanRepositoryInterface){}
    model = 'gpt-4o-mini-2024-07-18';
    temperature = 1;
    store = false;

    async createQuestions(userId: string, goal: string): Promise<QuestionsFromAI | null> {
        const questions = await client.responses.parse({
            model: this.model,
            temperature: this.temperature,
            input: questionsPromt(goal),
            text: {
                format: zodTextFormat(questionsSchema, 'questions_schema'),
            },
            store: this.store,
        });
        const questionsres: QuestionsFromAI | null = questions.output_parsed
        return questionsres;
    }

    async createPlan(userId: string, goal: string): Promise<PlanEntity> {
        const createPlan = await client.responses.parse({
            model: this.model,
            temperature: this.temperature,
            input: planPromt(goal),
            text: {
                format: zodTextFormat(planSchema, 'plan_schema'),
            },
            store: this.store,
        });
        const plan: TaskFromAI[][] | void = createPlan.output_parsed?.plan;
        if(!plan) throw ApiError.serverError('Error with creating plan')
        return await this.planRepo.createPlan(userId, plan);
    }

    async getUserPlans(userId: string): Promise<PlanEntity[]> {
        const plans: PlanEntity[] = await this.planRepo.getAllPlans(userId) ;
        return plans;
    }

    async completePlanTask(userId: string, taskId: string): Promise<PlanEntity> {
        const updated: PlanEntity | null = await this.planRepo.completeTask(userId, taskId)
        if (!updated) {
            throw ApiError.badRequest('Task is already done');
        }
        await userService.increaseBalance(userId, 20);
        return updated;
    }

    async uncompletePlanTask(userId: string, taskId: string): Promise<PlanEntity> {
        const updated: PlanEntity | null = await this.planRepo.uncompleteTask(userId, taskId)
        if (!updated) {
            throw ApiError.badRequest('Task is already mark as not done');
        }
        await userService.decreaseBalance(userId, 20);
        return updated;
    }

    async removeGoal(userId: string, planId: string): Promise<{message: string}> {
        await this.planRepo.deletePlan(planId)
        return { message: 'Plan was deleted' };
    }

    async removeGoals(userId: string): Promise<void> {
        await this.planRepo.deleteAllPlans(userId)
    }
}
