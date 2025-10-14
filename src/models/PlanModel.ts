// src/models/PlanModel.ts
import { Schema, model, Types } from 'mongoose';

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
    { timestamps: true }
);

PlanSchema.index({ userId: 1 });

export default model<PlanModel>('Plan', PlanSchema);
