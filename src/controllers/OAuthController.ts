import { FastifyRequest, FastifyReply } from 'fastify';
import { fastify } from '../server';
import OAuthService from '../services/OAuthService';

export default class OAuthController {
    constructor(readonly oauthService: OAuthService ){}
    async callback(request: FastifyRequest, reply: FastifyReply) {
        const { token } =
            await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
                request
            );
        const userData = await this.oauthService.auth(token.access_token);
        return reply.send(userData);
    }
}
