import { PlanEntity, TaskEntity, TaskFromAI } from "../../../../domain/plan/models/PlanEntity";
import { PlanDocument, Task, Week } from "./PostgresPlanRepository";

interface DBMapper {
    toEntity(planDocument: PlanDocument): PlanEntity;
    toDB(planEntity: TaskFromAI[][]): object;
    toTaskEntity(task: Task): TaskEntity
}

const weeksMapper = (weeks: Week[]): TaskEntity[][]=> {
    return weeks 
    .sort((a, b) => a.index - b.index)
    .map(week =>
      week.tasks
        .sort((a, b) => a.index - b.index)
        .map(task => ({
          id: task.id,
          task: task.task,
          isDone: task.isDone,
        }))
    );
}

class PlanMapper implements DBMapper {
    toEntity(plan: PlanDocument): PlanEntity{
        return new PlanEntity(plan.id, plan.userId, weeksMapper(plan.weeks))
    }

    toDB(plan: TaskFromAI[][]){
        const doc = {
            create: plan.map((weekTasks, weekIndex) => ({
                index: weekIndex,
                tasks: {
                    create: weekTasks.map((task, taskIndex)=>({
                        index: taskIndex,
                        task: task.task
                    }))
                }
            }))
        }
        return doc
    }

    toTaskEntity(task: Task): TaskEntity{
        const taskEntity = {id: task.id, task: task.task, isDone: task.isDone}
        return taskEntity
    }
}

export const mapper = new PlanMapper()