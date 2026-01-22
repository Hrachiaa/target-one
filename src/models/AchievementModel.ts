import { Schema, model } from 'mongoose';

const AchievmentSchema = new Schema({
    achievment_name: { type: String, required: true },
    icon: { type: String, required: true },
    price: { type: Number, required: true },
    isUnlocked: { type: Boolean, default: false },
});

const AchievementSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        unique: true,
        ref: 'User',
        required: true,
    },
    balance: { type: Number, default: 0 },
    achievements: { type: [AchievmentSchema], required: true },
});

export default model('Achievement', AchievementSchema);
