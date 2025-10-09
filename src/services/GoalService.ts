import { zodTextFormat } from 'openai/helpers/zod';
import planPromt from '../promts/planPromt';
import questionsPromt from '../promts/questionsPromt';
import client from '../config/openai';
import ApiError from '../core/errors/ApiError';
import PlanModel from '../models/PlanModel';
import { questionsSchema, planSchema } from '../schemas/goalSchemas';

export default class GoalService {
    static model = 'gpt-4o-mini-2024-07-18';
    static temperature = 1;
    static store = false;

    static async createQuestions(userId: string, goal: string) {
        try {
            const plan = await client.responses.parse({
                model: this.model,
                temperature: this.temperature,
                input: questionsPromt(goal),
                text: {
                    format: zodTextFormat(questionsSchema, 'questions_schema'),
                },
                store: this.store,
            });
            return plan.output_parsed;
        } catch (error) {
            throw ApiError.serverError('Some error with creating questions');
        }
    }

    static async createPlan(userId: string, goal: string) {
        try {
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
            return await PlanModel.create({ userId, plan: plan.plan });
        } catch (error: any) {
            console.error('createPlan failed:', {
                name: error?.name,
                code: error?.code,
                message: error?.message,
                stack: error?.stack,
                cause: error?.cause,
                keyValue: error?.keyValue,
                errors: error?.errors,
            });
        }
    }

    static async getUserPlans(userId: string) {
        const plans = await PlanModel.find({ userId });
        return plans || [];
    }
}
