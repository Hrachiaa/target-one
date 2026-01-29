export interface QuestionsFromAI {
        goal: string;
        questions: {
            options: string[];
            question: string;
        }[]
}

export interface TaskFromAI {
    task: string
}

export interface TaskEntity {
    id: string;
    task: string;
    isDone: boolean;
}

export class PlanEntity {
    constructor(    
        readonly userId: string,
        readonly plan: TaskEntity[][],
    ){}
} 