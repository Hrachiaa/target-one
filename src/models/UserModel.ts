import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
            lowerCase: true,
        },
        googleId: { type: String, unique: true, sparse: true },
        password: { type: String },
    },
    { timestamps: true }
);

export default model('User', UserSchema);
