import { Schema, Types, model } from 'mongoose';

export interface AchievementItemDocument {
    _id: Types.ObjectId;
    achievementName: string;
    icon: string;
    price: number;
    isUnlocked: boolean
}

export interface AchievementsDocument {
    _id: Types.ObjectId;
    userId: string;
    achievements: AchievementItemDocument[];
    __v: number;
} 

const AchievementSchema = new Schema({
    achievementName: { type: String, required: true },
    icon: { type: String, required: true },
    price: { type: Number, required: true },
    isUnlocked: { type: Boolean, default: false },
});

const AchievementsSchema = new Schema({
    userId: {
        type: String,
        unique: true,
        required: true,
    },
    achievements: { type: [AchievementSchema], required: true },
});

export default model('Achievement', AchievementsSchema);
