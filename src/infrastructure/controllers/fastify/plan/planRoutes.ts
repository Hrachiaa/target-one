import { FastifyInstance } from 'fastify';
import { sessionController } from '../../../../server';
import { PlanController } from './PlanController';
import planRouteSchemas from './planRouteSchemas';

export const planRoutes = async (app: FastifyInstance, opts: {controller: PlanController}) => {
    const {controller} = opts
    app.addHook('preHandler', sessionController.authentication);
    app.post('/create', 
        {
            schema: planRouteSchemas.create,
        },
        controller.create.bind(controller)
    );
    app.post('/complete',
        {
            schema: planRouteSchemas.complete,
        },
        controller.completePlanTask.bind(controller)
    );
    app.post('/uncomplete',
        {
            schema: planRouteSchemas.uncomplete,
        },
        controller.uncompletePlanTask.bind(controller)
    );
    app.get('/plans',
        {
            schema: planRouteSchemas.getPlans,
        },
        controller.getUserPlans.bind(controller)
    );
    app.post('/delete',
        {
            schema: planRouteSchemas.deletePlan,
        },
        controller.deletePlan.bind(controller)
    );
};

