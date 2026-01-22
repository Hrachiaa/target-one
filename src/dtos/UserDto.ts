import { Types } from "mongoose";

export default class UserDto {
    id: string;
    email: string;
    googleId: string | null;
    constructor({
        _id,
        email,
        googleId = null,
    }: {
        _id: Types.ObjectId;
        email: string;
        googleId: string | null;
    }) {
        this.id = String(_id);
        this.email = email;
        this.googleId = googleId;
    }
}
