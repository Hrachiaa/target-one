import { Schema, Types, model } from 'mongoose';

export interface CodeDocument{
    _id: Types.ObjectId;
    userId: String;
    code: string;
    createdAt: NativeDate;
    __v: number;
}

const ConfirmationCodeSchema = new Schema({
    userId: {
        type: String,
        required: true,
        ref: 'User',
        unique: true,
    },
    code: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 15 * 60 },
});

export default model('Code', ConfirmationCodeSchema);
