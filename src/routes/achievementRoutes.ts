import { FastifyInstance } from 'fastify';
import AchievementController from '../controllers/AchievementController';
import { sessionController } from '../server';

const achievementRoutes = async (app: FastifyInstance) => {
    app.addHook('preHandler', sessionController.authentication);
    app.get('/', AchievementController.getAchievments);
    app.post('/unlock', AchievementController.unlockUchievment);
    app.post('/avatar', AchievementController.setAvatar);
};

export default achievementRoutes;
