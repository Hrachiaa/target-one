import { PlanEntity, TaskFromAI } from "../../../../domain/plan/models/PlanEntity"
import { PlanRepositoryInterface } from "../../../../domain/plan/PlanRepository";
import { prisma } from "../prisma"
import { mapper } from "./PlanMapper";

export interface Task {
    id: string;
    task: string;
    isDone: boolean;
    index: number;
    weekId: string;
}

export interface Week {
    id: string;
    index: number;
    planId: string;
    tasks: Task[];
}

export interface PlanDocument {
    id: string;
    userId: string;
    weeks: Week[]
}

export class PostgresPlanRepository implements PlanRepositoryInterface {
    async createPlan (userId: string, plan: TaskFromAI[][]): Promise<PlanEntity>{
        const weeks = mapper.toDB(plan)
        const doc: PlanDocument = await prisma.plan.create(
            {data: {
                userId, 
                weeks
            }, 
            include: {
                weeks: {
                include: {
                    tasks: true,
                },
                },
            },
        })
        return mapper.toEntity(doc)
    }

    async getAllPlans(userId: string): Promise<PlanEntity[] | []>{
        const plans: PlanDocument[] = await prisma.plan.findMany({
            where: { userId },
            include: {
                weeks: {
                include: {
                    tasks: true
                }
                }
            }
        });
        if(!plans.length) return []
        return plans.map(plan=> mapper.toEntity(plan))
    }

    async completeTask (userId: string, taskId: string) {
        const doc: Task | null= await prisma.task.update({
            where: {
                id: taskId,
                isDone: false
            },
            data: {
                isDone: true
            }
        })
        if(!doc) return null
        return mapper.toTaskEntity(doc)
    }

    async uncompleteTask (userId: string, taskId: string) {
        const doc: Task | null= await prisma.task.update({
            where: {
                id: taskId,
                isDone: true
            },
            data: {
                isDone: false
            }
        })
        if(!doc) return null
        return mapper.toTaskEntity(doc)
    }

    async deletePlan(planId: string): Promise<void>{
        await prisma.plan.delete({where: {id: planId}})
    }
    
    async deleteAllPlans(userId: string): Promise <void>{
        await prisma.plan.deleteMany({where: { userId }});
    }
}