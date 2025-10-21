// src/models/PlanModel.ts
import { Schema, model, Types, Document } from 'mongoose';

export interface TaskModel {
    task: string;
    isDone: boolean;
}
export interface PlanModel {
    userId: Types.ObjectId;
    plan: TaskModel[][];
    createdAt: Date;
    updatedAt: Date;
}

type PlanDoc = Document & PlanModel;

const TaskSchema = new Schema<TaskModel>({
    task: { type: String, required: true },
    isDone: { type: Boolean, default: false },
});

const PlanSchema = new Schema<PlanModel>(
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

PlanSchema.virtual('progress').get(function (this: PlanDoc) {
    if (!this.plan) return 0;
    let count = 0;
    for (const week of this.plan) {
        for (const task of week) {
            if (task?.isDone) count++;
        }
    }
    return count;
});

PlanSchema.index({ userId: 1 });

export default model<PlanModel>('Plan', PlanSchema);
