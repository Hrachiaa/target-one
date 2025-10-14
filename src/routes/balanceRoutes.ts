import { FastifyInstance } from 'fastify';
import SessionController from '../controllers/SessionController';
import BalanceController from '../controllers/BalanceController';

const balanceRoutes = async (app: FastifyInstance) => {
    app.addHook('preHandler', SessionController.authentication);
    app.get('/', BalanceController.getBalance);
};

export default balanceRoutes;
