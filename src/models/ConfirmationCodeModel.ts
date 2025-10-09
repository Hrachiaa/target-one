import { Schema, model } from 'mongoose';

const ConfirmationCodeSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        unique: true,
    },
    code: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 15 * 60 },
});

export default model('Code', ConfirmationCodeSchema);
