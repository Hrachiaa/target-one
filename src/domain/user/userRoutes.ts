import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import UserController from '../../infrastructure/controllers/user/UserController';
import authRouteSchemas from '../../schemas/authRouteSchemas';
import { userController } from '../../server';

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
    app.post('/changepassword', controller.changePassword);
    app.get('/confirmemail', controller.confirmEmail);
    app.post('/checkconfirmcode', controller.confirmCodeEmail);
    app.post('/deleteuser', controller.deleteUser);

    app.get('/tokentest', controller.tokenTest);
};

export default userRoutes;
