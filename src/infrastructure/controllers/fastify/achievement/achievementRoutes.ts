import { FastifyInstance } from 'fastify';
import AchievementController from './AchievementController';
import { sessionController } from '../../../../server';

const achievementRoutes = async (app: FastifyInstance, opts: {controller: AchievementController}) => {
    const {controller} = opts
    app.addHook('preHandler', sessionController.authentication);
    app.get('/', controller.getAchievments.bind(controller));
    app.post('/unlock', controller.unlockUchievment.bind(controller));
    app.post('/avatar', controller.setAvatar.bind(controller));
};

export default achievementRoutes;
