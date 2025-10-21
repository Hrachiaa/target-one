import { zodTextFormat } from 'openai/helpers/zod';
import planPromt from '../promts/planPromt';
import questionsPromt from '../promts/questionsPromt';
import client from '../config/openai';
import ApiError from '../core/errors/ApiError';
import PlanModel from '../models/PlanModel';
import { questionsSchema, planSchema } from '../schemas/goalSchemas';
import { Types } from 'mongoose';
import BalanceService from './BalanceService';

export default class GoalService {
    static model = 'gpt-4o-mini-2024-07-18';
    static temperature = 1;
    static store = false;

    static async createQuestions(userId: string, goal: string) {
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
        return await PlanModel.create({ userId, plan: plan.plan });
    }

    static async getUserPlans(userId: string) {
        const plans = await PlanModel.find({ userId });
        return plans || [];
    }

    static async completePlanTask(userId: string, taskId: string) {
        const updated = await PlanModel.findOneAndUpdate(
            {
                userId,
                plan: {
                    $elemMatch: {
                        $elemMatch: {
                            _id: new Types.ObjectId(taskId),
                            isDone: false,
                        },
                    },
                },
            },
            { $set: { 'plan.$[].$[inner].isDone': true } },
            {
                arrayFilters: [{ 'inner._id': new Types.ObjectId(taskId) }],
                new: true,
            }
        );
        if (!updated) {
            throw ApiError.badRequest('Task is already done');
        }
        await BalanceService.increaseBalance(userId, 20);
        return updated;
    }

    static async uncompletePlanTask(userId: string, taskId: string) {
        const updated = await PlanModel.findOneAndUpdate(
            {
                userId,
                plan: {
                    $elemMatch: {
                        $elemMatch: {
                            _id: new Types.ObjectId(taskId),
                            isDone: true,
                        },
                    },
                },
            },
            { $set: { 'plan.$[].$[inner].isDone': false } },
            {
                arrayFilters: [{ 'inner._id': new Types.ObjectId(taskId) }],
                new: true,
            }
        );
        if (!updated) {
            throw ApiError.badRequest('Task is already mark as not done');
        }
        await BalanceService.decreaseBalance(userId, 20);
        return updated;
    }
}
