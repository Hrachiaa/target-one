import { FastifyInstance } from 'fastify';
import OAuthController from '../controllers/OAuthController';

const oauthRoutes = async (app: FastifyInstance, oauthController: OAuthController) => {
    app.get('/google/callback', oauthController.callback);
};

export default oauthRoutes;
