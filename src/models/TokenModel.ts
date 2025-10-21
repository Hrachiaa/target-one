import { Schema, model } from 'mongoose';

const TokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    refreshToken: { type: String, required: true },
});

export default model('Token', TokenSchema);
