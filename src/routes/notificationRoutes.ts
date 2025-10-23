import { FastifyInstance } from 'fastify';
import SessionController from '../controllers/SessionController';
import NotificationController from '../controllers/NotificationController';

const notificationRoutes = async (app: FastifyInstance) => {
    app.addHook('preHandler', SessionController.authentication);
    app.post('/device-token', NotificationController.saveDeviceToken);
    app.delete('/device-token', NotificationController.deleteDeviceToken);
};

export default notificationRoutes;
