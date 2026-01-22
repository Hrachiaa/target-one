import { FastifyInstance } from 'fastify';
import SessionController from '../controllers/SessionController';
import authRouteSchemas from '../schemas/authRouteSchemas';

const sessionRoutes = async (app: FastifyInstance) => {
    app.post(
        '/logout',
        // {
        //     schema: authRouteSchemas.getRefreshSchema,
        // },
        SessionController.logout
    );
    app.post(
        '/refresh',
        // {
        //     schema: authRouteSchemas.getRefreshSchema,
        // },
        SessionController.refresh
    );
};

export default sessionRoutes;
