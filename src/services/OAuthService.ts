import { fastify } from '../server';
import TokenService from './TokenService';
import AchievementService from './AchievementService';
import {MongoUserRepository} from '../infrastructure/db/mongoDB/user/MongoUserRepository';
import { UserRepositoryInterface } from '../domain/user/UserRepository';

export default class {
    constructor(readonly userRepo: UserRepositoryInterface) {}
    async auth(token: string) {
        const userInfo = await fastify.googleOAuth2.userinfo(token);

        const condidate = await this.userRepo.findUserByGoogleId(userInfo.sub);
        if (condidate) {
            const tokens = await TokenService.tokenService(condidate);
            return tokens;
        }

        const condidateWithEmail = await this.userRepo.findUserWithEmail(userInfo.email, null);

        if (condidateWithEmail) {
            await this.userRepo.verifyUserWithEmail(condidateWithEmail.id, userInfo.sub)

            return await TokenService.tokenService(condidateWithEmail);
        }

        const user = await this.userRepo.createUserWithGoogleId(userInfo.sub, userInfo.email)

        AchievementService.createDefaultAchievements(user.id.toString());
        const tokens = await TokenService.tokenService(user);

        return tokens;
    }
}
