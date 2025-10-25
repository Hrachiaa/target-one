import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import AuthControllers from '../controllers/AuthController';
import authRouteSchemas from '../schemas/authRouteSchemas';

const authRoutes = async (app: FastifyInstance) => {
    app.post(
        '/registration',
        {
            schema: authRouteSchemas.authSchema,
        },
        AuthControllers.registration
    );
    app.post(
        '/login',
        {
            schema: authRouteSchemas.authSchema,
        },
        AuthControllers.login
    );
    app.post(
        '/forgot',
        {
            schema: authRouteSchemas.forgotPassSchema,
        },
        AuthControllers.forgot
    );
    app.post(
        '/checkresetcode',
        {
            schema: authRouteSchemas.checkCode,
        },
        AuthControllers.checkCode
    );
    app.post(
        '/reset',
        {
            schema: authRouteSchemas.reset,
        },
        AuthControllers.reset
    );
    app.post('/changepassword', AuthControllers.changePassword);
    app.get('/confirmemail', AuthControllers.confirmEmail);
    app.post('/checkconfirmcode', AuthControllers.changePassword);

    app.get('/tokentest', AuthControllers.tokenTest);
};

export default authRoutes;
