import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
            lowerCase: true,
            required: true,
        },
        emailVerified: { type: Boolean, default: false },
        googleId: { type: String, unique: true, sparse: true },
        password: { type: String },
        avatar: { type: String, default: 'https://cdn/first-login.png' },
    },
    { timestamps: true }
);

export default model('User', UserSchema);
