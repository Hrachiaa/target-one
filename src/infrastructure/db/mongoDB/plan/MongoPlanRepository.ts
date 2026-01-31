import { Types } from "mongoose";
import PlanModel, { PlanDocument } from "./PlanModel";
import { PlanEntity, TaskFromAI } from "../../../../domain/plan/models/PlanEntity";
import { mapper } from "./PlanMapper";
import { PlanRepositoryInterface } from "../../../../domain/plan/PlanRepository";

export class MongoPlanRepository implements PlanRepositoryInterface{
    async createPlan (userId: string, plan: TaskFromAI[][]): Promise<PlanEntity>{
        const doc: PlanDocument = await PlanModel.create({userId, plan})
        const planEntity = mapper.toEntity(doc)
        return planEntity
    }

    async getAllPlans (userId: string): Promise <PlanEntity[]>{
        const doc: PlanDocument[] = await PlanModel.find({userId})
        if(!doc.length) return []
        const plansEntity = doc.map(mapper.toEntity)
        return plansEntity
    }

    async completeTask (userId: string, taskId: string) {
        const doc: PlanDocument | null= await PlanModel.findOneAndUpdate(
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
        if(!doc) return null
        return mapper.toEntity(doc)
    }

    async uncompleteTask (userId: string, taskId: string) {
        const doc: PlanDocument | null = await PlanModel.findOneAndUpdate(
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
        if(!doc) return null
        return mapper.toEntity(doc)
    }

    async deletePlan(planId: string): Promise<void>{
        await PlanModel.findByIdAndDelete(planId)
    }

    async deleteAllPlans(userId: string): Promise <void>{
        await PlanModel.findOneAndDelete({ userId });
    }
}