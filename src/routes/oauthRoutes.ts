import { FastifyInstance } from 'fastify';
import OAuthController from '../controllers/OAuthController';

const oauthRoutes = async (app: FastifyInstance) => {
    app.get('/google/callback', OAuthController.callback);
};

export default oauthRoutes;
