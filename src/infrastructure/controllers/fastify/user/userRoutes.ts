import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import UserController from './UserController';
import authRouteSchemas from './userRouteSchemas';

const userRoutes = async (app: FastifyInstance, opts: { controller: UserController }) => {
    const { controller } = opts

    app.post(
        '/registration',
        // {
        //     schema: authRouteSchemas.authSchema,
        // },
        controller.registration.bind(controller)
    );
    app.post(
        '/login',
        // {
        //     schema: authRouteSchemas.authSchema,
        // },
        controller.login.bind(controller)
    );
    app.post(
        '/forgot',
        // {
        //     schema: authRouteSchemas.forgotPassSchema,
        // },
        controller.forgot.bind(controller)
    );
    app.post(
        '/checkresetcode',
        // {
        //     schema: authRouteSchemas.checkCode,
        // },
        controller.checkCode.bind(controller)
    );
    app.post(
        '/reset',
        // {
        //     schema: authRouteSchemas.reset,
        // },
        controller.reset.bind(controller)
    );
    app.post('/changepassword', controller.changePassword.bind(controller));
    app.get('/confirmemail', controller.confirmEmail.bind(controller));
    app.post('/checkconfirmcode', controller.confirmCodeEmail.bind(controller));
    app.post('/deleteuser', controller.deleteUser.bind(controller));
    app.get('/balance', controller.getBalance.bind(controller));
    app.get('/google/callback', controller.callback.bind(controller));

};

export default userRoutes;
