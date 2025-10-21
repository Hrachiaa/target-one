import { FastifyInstance } from 'fastify';
import GoalController from '../controllers/GoalController';
import SessionController from '../controllers/SessionController';

const goalRoutes = async (app: FastifyInstance) => {
  app.addHook('preHandler', SessionController.authentication);
  app.post('/create', GoalController.create);
  app.get('/plans', GoalController.getUserPlans);
};

export default goalRoutes;
