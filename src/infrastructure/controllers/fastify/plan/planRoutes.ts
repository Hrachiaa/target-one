import { FastifyInstance } from 'fastify';
import { sessionController } from '../../../../server';
import { PlanController } from './PlanController';

export const planRoutes = async (app: FastifyInstance, opts: {controller: PlanController}) => {
    const {controller} = opts
    app.addHook('preHandler', sessionController.authentication);
    app.post('/create', controller.create.bind(controller));
    app.post('/complete', controller.completePlanTask.bind(controller));
    app.post('/uncomplete', controller.uncompletePlanTask.bind(controller));
    app.get('/plans', controller.getUserPlans.bind(controller));
    app.post('/delete', controller.deletePlan.bind(controller));
};

