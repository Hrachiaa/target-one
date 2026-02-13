import { FastifyInstance } from 'fastify';
import AchievementController from './AchievementController';
import { sessionController } from '../../../../server';
import achievementRouteSchemas from './achievementRouteSchemas';

const achievementRoutes = async (app: FastifyInstance, opts: {controller: AchievementController}) => {
    const {controller} = opts
    app.addHook('preHandler', sessionController.authentication);
    app.get('/',
        {
            schema: achievementRouteSchemas.getAchievements,
        },
        controller.getAchievments.bind(controller)
    );
    app.post('/unlock',
        {
            schema: achievementRouteSchemas.unlockAchievement,
        },
        controller.unlockUchievment.bind(controller)
    );
    app.post('/avatar',
        {
            schema: achievementRouteSchemas.setAvatar,
        },
        controller.setAvatar.bind(controller)
    );
};

export default achievementRoutes;
