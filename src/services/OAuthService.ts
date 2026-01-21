import { fastify } from '../server';
import TokenService from './TokenService';
import AchievementService from './AchievementService';
import UserRepository from '../repositories/mongoDB/UserRepository';

export default class {
    static async auth(token: string) {
        const userInfo = await fastify.googleOAuth2.userinfo(token);

        const condidate = await UserRepository.findUserByGoogleId(userInfo.sub);
        if (condidate) {
            const tokens = await TokenService.tokenService(condidate);
            return tokens;
        }

        const condidateWithEmail = await UserRepository.findUserWithEmail(userInfo.email);

        if (condidateWithEmail) {
            await UserRepository.verifyUserWithEmail(String(condidateWithEmail._id), userInfo.sub)

            return await TokenService.tokenService(condidateWithEmail);
        }

        const user = await UserRepository.createUserWithGoogleId(userInfo.sub, userInfo.email)

        AchievementService.createDefaultAchievements(user._id.toString());
        const tokens = await TokenService.tokenService(user);

        return tokens;
    }
}
