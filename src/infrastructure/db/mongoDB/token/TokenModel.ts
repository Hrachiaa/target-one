import { Schema, Types, model } from 'mongoose';

export interface TokenDocument {
    _id: Types.ObjectId;
    userId: string;
    refreshToken: string;
    __v: number
}

const TokenSchema = new Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true,
        unique: true,
    },
    refreshToken: { type: String, required: true },
});

export default model('Token', TokenSchema);
