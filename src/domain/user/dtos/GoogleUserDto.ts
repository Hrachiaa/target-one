export class GoogleUserDto {
    googleId: string;
    email: string;
    constructor({sub, email}: {sub: string, email: string}) {
        this.googleId = sub;
        this.email = email;
    }
}