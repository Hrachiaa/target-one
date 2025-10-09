export default class UserDto {
    id: any;
    email: string | null;
    googleId: string | null;
    constructor({
        _id,
        email = null,
        googleId = null,
    }: {
        _id: any;
        email: string | null;
        googleId: string | null;
    }) {
        this.id = _id;
        this.email = email;
        this.googleId = googleId;
    }
}
