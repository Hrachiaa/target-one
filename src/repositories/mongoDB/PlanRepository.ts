import { Types } from "mongoose";
import PlanModel from "../../models/PlanModel";

export default class PlanRepository {
    static async createPlan (userId: string, plan: {task: string}[][]){
        return await PlanModel.create({userId, plan})
    }

    static async getAllPlans (userId: string){
        return await PlanModel.find({userId})
    }

    static async completeTask (userId: string, taskId: string) {
        return await PlanModel.findOneAndUpdate(
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
        )
    }

    static async uncompleteTask (userId: string, taskId: string) {
        return await PlanModel.findOneAndUpdate(
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
        )
    }

    static async deletePlan(planId: string){
        await PlanModel.findByIdAndDelete(planId)
    }

    static async deletAllePlans(userId: string){
        await PlanModel.findOneAndDelete({ userId });
    }
}