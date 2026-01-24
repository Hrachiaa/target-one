import { FastifyInstance } from 'fastify';
import BalanceController from '../controllers/BalanceController';
import { sessionController } from '../server';

const balanceRoutes = async (app: FastifyInstance) => {
    app.addHook('preHandler', sessionController.authentication);
    app.get('/', BalanceController.getBalance);
};

export default balanceRoutes;
