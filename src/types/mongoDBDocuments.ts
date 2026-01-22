import { Types } from "mongoose";

export interface UserDocument {
    _id: Types.ObjectId;
    email: string;
    emailVerified: boolean;
    googleId?: string | null;
    password?: string | null;
    avatar: string;
    createdAt: NativeDate;
    updatedAt: NativeDate
    __v: number;
}