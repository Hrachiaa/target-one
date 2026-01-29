// src/models/PlanModel.ts
import { Schema, model, Types, Document } from 'mongoose';

export interface TaskDocument {
    _id: Types.ObjectId;
    task: string;
    isDone: boolean;
}
export interface PlanDocument {
    userId: Types.ObjectId;
    plan: TaskDocument[][];
    createdAt: Date;
    updatedAt: Date;
}

type PlanDoc = Document & PlanDocument;

const TaskSchema = new Schema({
    task: { type: String, required: true },
    isDone: { type: Boolean, default: false },
});

const PlanSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        plan: {
            type: [[TaskSchema]],
            required: true,
            validate: {
                validator: (v: any[][]) =>
                    v.length === 4 && v.every((w) => w.length === 7),
                message: 'Plan has to comprise 4 weeks and 7 days',
            },
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Сколько задач выполнено за весь план
PlanSchema.virtual('countMonth').get(function (this: PlanDoc) {
    const plan = this.plan ?? [];
    return plan.flat().reduce((n, t) => n + (t?.isDone ? 1 : 0), 0);
});

// Процент выполнения за весь план (округляем до целого)
PlanSchema.virtual('progressMonth').get(function (this: PlanDoc) {
    const plan = this.plan ?? [];
    const total = plan.reduce(
        (sum, week) => sum + (Array.isArray(week) ? week.length : 0),
        0
    );
    const done = plan.flat().reduce((n, t) => n + (t?.isDone ? 1 : 0), 0);
    return total ? Math.round((done / total) * 100) : 0;
});

// Кол-во выполненных задач по неделям [w1,w2,w3,w4]
PlanSchema.virtual('countWeekly').get(function (this: PlanDoc) {
    const plan = this.plan ?? [];
    return plan.map((week) =>
        week.reduce((n, t) => n + (t?.isDone ? 1 : 0), 0)
    );
});

// Процент выполнения по неделям [%, %, %, %]
PlanSchema.virtual('progressWeekly').get(function (this: PlanDoc) {
    const plan = this.plan ?? [];
    return plan.map((week) => {
        const total = week.length || 0;
        const done = week.reduce((n, t) => n + (t?.isDone ? 1 : 0), 0);
        return total ? Math.round((done / total) * 100) : 0;
    });
});

PlanSchema.index({ userId: 1 });

export default model<PlanDocument>('Plan', PlanSchema);
