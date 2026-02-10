import { PlanEntity, TaskEntity, TaskFromAI } from "./models/PlanEntity";

export interface PlanRepositoryInterface {
    createPlan (userId: string, plan: TaskFromAI[][]): Promise<PlanEntity>;
    getAllPlans (userId: string): Promise<PlanEntity[]>;
    completeTask (userId: string, taskId: string): Promise<TaskEntity | null>;
    uncompleteTask (userId: string, taskId: string): Promise<TaskEntity | null>;
    deletePlan (planId: string,): Promise<void>;
    deleteAllPlans (userId: string): Promise<void>;
}