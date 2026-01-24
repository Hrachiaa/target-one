import { FastifyInstance } from 'fastify';
import GoalController from '../controllers/GoalController';
import { sessionController } from '../server';

const goalRoutes = async (app: FastifyInstance) => {
    app.addHook('preHandler', sessionController.authentication);
    app.post('/create', GoalController.create);
    app.post('/complete', GoalController.completePlanTask);
    app.post('/uncomplete', GoalController.uncompletePlanTask);
    app.get('/plans', GoalController.getUserPlans);
    app.post('/delete', GoalController.deletePlan);
};

export default goalRoutes;
