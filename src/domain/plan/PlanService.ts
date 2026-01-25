import { zodTextFormat } from 'openai/helpers/zod';
import planPromt from './promts/planPromt';
import questionsPromt from './promts/questionsPromt';
import {client} from '../../infrastructure/config/openai';
import ApiError from '../utils/errors/ApiError';
import { questionsSchema, planSchema } from './schemas/planSchemas';
import PlanRepository from '../../infrastructure/db/mongoDB/plan/PlanRepository';
import { userService } from '../../server';

export default class GoalService {
    static model = 'gpt-4o-mini-2024-07-18';
    static temperature = 1;
    static store = false;

    static async createQuestions(userId: string, goal: string) {
        const questions = await client.responses.parse({
            model: this.model,
            temperature: this.temperature,
            input: questionsPromt(goal),
            text: {
                format: zodTextFormat(questionsSchema, 'questions_schema'),
            },
            store: this.store,
        });
        return questions.output_parsed;
    }

    static async createPlan(userId: string, goal: string) {
        const createPlan = await client.responses.parse({
            model: this.model,
            temperature: this.temperature,
            input: planPromt(goal),
            text: {
                format: zodTextFormat(planSchema, 'plan_schema'),
            },
            store: this.store,
        });
        const plan = createPlan.output_parsed!;
        return await PlanRepository.createPlan(userId, plan.plan);
    }

    static async getUserPlans(userId: string) {
        const plans = await PlanRepository.getAllPlans(userId) ;
        return plans || [];
    }

    static async completePlanTask(userId: string, taskId: string) {
        const updated = await PlanRepository.completeTask(userId, taskId)
        if (!updated) {
            throw ApiError.badRequest('Task is already done');
        }
        await userService.increaseBalance(userId, 20);
        return updated;
    }

    static async uncompletePlanTask(userId: string, taskId: string) {
        const updated = await PlanRepository.uncompleteTask(userId, taskId)
        if (!updated) {
            throw ApiError.badRequest('Task is already mark as not done');
        }
        await userService.decreaseBalance(userId, 20);
        return updated;
    }

    static async removeGoal(userId: string, planId: string) {
        await PlanRepository.deletePlan(planId)
        return { message: 'Plan was deleted' };
    }

    static async removeGoals(userId: string) {
        await PlanRepository.deletAllePlans(userId)
    }
}
