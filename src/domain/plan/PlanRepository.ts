import { PlanEntity, TaskFromAI } from "./models/PlanEntity";

export interface PlanRepositoryInterface {
    createPlan (userId: string, plan: TaskFromAI[][]): Promise<PlanEntity>;
    getAllPlans (userId: string): Promise<PlanEntity[]>;
    completeTask (userId: string, taskId: string): Promise<PlanEntity | null>;
    uncompleteTask (userId: string, taskId: string): Promise<PlanEntity | null>;
    deletePlan (planId: string,): Promise<void>;
    deleteAllPlans (userId: string): Promise<void>;
}