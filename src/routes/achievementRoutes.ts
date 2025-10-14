import { FastifyInstance } from 'fastify';
import SessionController from '../controllers/SessionController';
import AchievementController from '../controllers/AchievementController';

const achievementRoutes = async (app: FastifyInstance) => {
    app.addHook('preHandler', SessionController.authentication);
    app.get('/', AchievementController.getAchievments);
    app.post('/unlock', AchievementController.unlockUchievment);
};

export default achievementRoutes;
