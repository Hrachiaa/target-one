import { fastify } from '../server';
import UserModel from '../models/UserModel';
import TokenService from './TokenService';

export default class {
    static async auth(token: string) {
        const userInfo = await fastify.googleOAuth2.userinfo(token);

        const condidate = await UserModel.findOne({ googleId: userInfo.sub });
        if (condidate) {
            const tokens = await TokenService.tokenService(condidate);
            return tokens;
        }

        const user = await UserModel.create({ googleId: userInfo.sub });
        const tokens = await TokenService.tokenService(user);
        return tokens;
    }
}
