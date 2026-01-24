import { FastifyInstance } from 'fastify';
import SessionController from './SessionController';
import authRouteSchemas from '../../../schemas/authRouteSchemas';

const sessionRoutes = async (app: FastifyInstance, opts: {controller: SessionController}) => {
    const {controller} = opts
    app.post(
        '/logout',
        // {
            // schema: authRouteSchemas.getRefreshSchema,
        // },
        controller.logout.bind(controller)
    );
    app.post(
        '/refresh',
        // {
        //     schema: authRouteSchemas.getRefreshSchema,
        // },
        controller.refresh.bind(controller)
    );
};

export default sessionRoutes;
