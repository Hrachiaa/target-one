import { fastify } from '../server';
import UserModel from '../models/UserModel';
import TokenService from './TokenService';
import AchievmentService from './AchievementService';

export default class {
    static async auth(token: string) {
        const userInfo = await fastify.googleOAuth2.userinfo(token);

        const condidate = await UserModel.findOne({ googleId: userInfo.sub });
        if (condidate) {
            const tokens = await TokenService.tokenService(condidate);
            return tokens;
        }

        const condidateWithEmail = await UserModel.findOne({
            email: userInfo.email,
            googleId: null,
        });

        if (condidateWithEmail) {
            condidateWithEmail.googleId = userInfo.sub;
            await condidateWithEmail.save();

            const tokens = await TokenService.tokenService(condidateWithEmail);
            return tokens;
        }

        const user = await UserModel.create({
            googleId: userInfo.sub,
            email: userInfo.email,
        });

        AchievmentService.createDefaultAchievments(user._id.toString());
        const tokens = await TokenService.tokenService(user);

        return tokens;
    }
}
