import z from 'zod';

const questionsSchema = z.object({
    goal: z.string(),
    questions: z
        .array(
            z.object({
                question: z.string(),
                options: z.array(z.string()).min(4).max(4),
            })
        )
        .min(2)
        .max(2),
});

const taskSchema = z.object({
    task: z.string(),
});

const weekSchema = z.array(taskSchema).min(7).max(7);

const planSchema = z.object({
    plan: z.array(weekSchema).min(4).max(4),
});

export { questionsSchema, planSchema };
