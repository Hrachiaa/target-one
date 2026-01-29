import { PlanEntity, TaskEntity } from "../../../../domain/plan/models/PlanEntity";
import { PlanDocument, TaskDocument } from "../plan/PlanModel";

const mapTask = (task: TaskDocument): TaskEntity => ({
    id: String(task._id),
    task: task.task,
    isDone: task.isDone,
})

const mapArrayofTask = (taskArray: TaskDocument[]): TaskEntity[] => {
    return taskArray.map(mapTask)
}

interface DBMapper<T> {
    toEntity(tokenDocument: PlanDocument): PlanEntity;
    toDB(tokenEntity: PlanEntity): T
}

class PlanMapper implements DBMapper<undefined> {
    toEntity(plan: PlanDocument): PlanEntity{
        return new PlanEntity(String(plan.userId), plan.plan.map(mapArrayofTask) )
    }
    toDB(plan: PlanEntity): undefined{
        return
    }
}

export const mapper = new PlanMapper()