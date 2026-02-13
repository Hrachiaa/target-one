import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import UserController from './UserController';
import authRouteSchemas from './userRouteSchemas';

const userRoutes = async (app: FastifyInstance, opts: { controller: UserController }) => {
    const { controller } = opts

    app.post(
        '/registration',
        {
            schema: authRouteSchemas.auth,
        },
        controller.registration.bind(controller)
    );
    app.post(
        '/login',
        {
            schema: authRouteSchemas.auth,
        },
        controller.login.bind(controller)
    );
    app.post(
        '/forgot',
        {
            schema: authRouteSchemas.forgotPass,
        },
        controller.forgot.bind(controller)
    );
    app.post(
        '/checkresetcode',
        {
            schema: authRouteSchemas.checkResetCode,
        },
        controller.checkCode.bind(controller)
    );
    app.post(
        '/reset',
        {
            schema: authRouteSchemas.reset,
        },
        controller.reset.bind(controller)
    );
    app.post('/changepassword',
        {
            schema: authRouteSchemas.changePassword,
        },
        controller.changePassword.bind(controller)
    );
    app.get('/confirmemail', 
        {
            schema: authRouteSchemas.confirmEmail,
        },
        controller.confirmEmail.bind(controller)
    );
    app.post('/checkconfirmcode',
        {
            schema: authRouteSchemas.checkConfirmCode,
        },
        controller.confirmCodeEmail.bind(controller)
    );
    app.get('/deleteuser',
        {
            schema: authRouteSchemas.deleteUser,
        },
        controller.deleteUser.bind(controller)
    );
    app.get('/balance',
        {
            schema: authRouteSchemas.balance,
        },
        controller.getBalance.bind(controller));
    app.get('/google/callback', controller.callback.bind(controller));

};

export default userRoutes;
