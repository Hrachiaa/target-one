import { FastifyInstance } from 'fastify';
import { sessionController } from '../../../server';
import AchievementController from './AchievementController';

const achievementRoutes = async (app: FastifyInstance) => {
    app.addHook('preHandler', sessionController.authentication);
    app.get('/', AchievementController.getAchievments);
    app.post('/unlock', AchievementController.unlockUchievment);
    app.post('/avatar', AchievementController.setAvatar);
};

export default achievementRoutes;
