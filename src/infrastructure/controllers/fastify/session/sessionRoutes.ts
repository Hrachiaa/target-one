import { FastifyInstance } from 'fastify';
import SessionController from './SessionController';
import sessionRouteSchemas from './sessionRouteSchemas';

const sessionRoutes = async (app: FastifyInstance, opts: {controller: SessionController}) => {
    const {controller} = opts
    app.post(
        '/logout',
        {
            schema: sessionRouteSchemas.logout,
        },
        controller.logout.bind(controller)
    );
    app.post(
        '/refresh',
        {
            schema: sessionRouteSchemas.refresh,
        },
        controller.refresh.bind(controller)
    );
};

export default sessionRoutes;
