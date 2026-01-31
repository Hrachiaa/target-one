export class UserEntity {
    constructor(
        readonly id: string,
        readonly email: string,
        readonly emailVerified: boolean,
        readonly googleId: string | null,
        readonly password: string | null,
        readonly balance: number,
        readonly avatar: string
    ){}
}