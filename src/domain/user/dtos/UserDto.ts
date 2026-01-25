export default class UserDto {
    id: string;
    email: string;
    googleId: string | null;
    constructor({
        id,
        email,
        googleId = null,
    }: {
        id: string;
        email: string;
        googleId: string | null;
    }) {
        this.id = id;
        this.email = email;
        this.googleId = googleId;
    }
}

export interface BalanceDto {
    balance: number
}
