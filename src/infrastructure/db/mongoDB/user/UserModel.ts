import { Schema, Types, model } from 'mongoose';

export interface UserDocument {
    _id: Types.ObjectId;
    email: string;
    emailVerified: boolean;
    googleId: string | null;
    password: string | null;
    avatar: string;
    createdAt: NativeDate;
    updatedAt: NativeDate
    __v: number;
}

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
        googleId: { type: String, unique: true, sparse: true, default: null },
        password: { type: String, default: null },
        avatar: { type: String, default: 'https://cdn/first-login.png' },
    },
    { timestamps: true }
);

export default model('User', UserSchema);
