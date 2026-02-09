require('dotenv').config();

const Fastify = require('fastify');
import jwt from '@fastify/jwt';
import fastifyOauth2 from '@fastify/oauth2';
import mongoose from 'mongoose';
import userRoutes from './infrastructure/controllers/fastify/user/userRoutes';
import errorHandler from './infrastructure/controllers/fastify/errorHandler';
import {MongoUserRepository} from './infrastructure/db/mongoDB/user/MongoUserRepository';
import UserService from './domain/user/UserService';
import UserControllers from './infrastructure/controllers/fastify/user/UserController';
import sessionRoutes from './infrastructure/controllers/fastify/session/sessionRoutes';
import { MongoTokenRepository } from './infrastructure/db/mongoDB/token/MongoTokenRepository';
import { TokenService } from './domain/token/TokenService';
import SessionController from './infrastructure/controllers/fastify/session/SessionController';
import achievementRoutes from './infrastructure/controllers/fastify/achievement/achievementRoutes';
import { MongoAchievementRepository } from './infrastructure/db/mongoDB/achievement/MongoAchievementRepository';
import AchievementService from './domain/achievement/AchievementService';
import AchievementController from './infrastructure/controllers/fastify/achievement/AchievementController';
import { MongoPlanRepository } from './infrastructure/db/mongoDB/plan/MongoPlanRepository';
import PlanService from './domain/plan/PlanService';
import { PlanController } from './infrastructure/controllers/fastify/plan/PlanController';
import { planRoutes } from './infrastructure/controllers/fastify/plan/planRoutes';
import { PostrgresUserRepository } from './infrastructure/db/postgreSQL/user/PostgresUserRepository';
import { MongoCodeRepository } from './infrastructure/db/mongoDB/confirmationCode/MongoCodeRepository';
import { CodeService } from './domain/confirmationCode/CodeService';
import { PostgresCodeRepository } from './infrastructure/db/postgreSQL/confirmationCode/PostgresCodeRepository';
import { PostgresTokenRepository } from './infrastructure/db/postgreSQL/token/PostgresTokenRepository';

const PORT = Number(process.env.PORT) || 5000;

const fastify = Fastify({
    logger: true,
    // logger: { level: 'trace' },
});

fastify.register(jwt, {
    secret: process.env.JWT_ACCESS_SECRET,
    namespace: 'accessJwt',
    jwtVerify: 'accessJwtVerify',
    jwtSign: 'accessJwtSign',
});

fastify.register(jwt, {
    secret: process.env.JWT_REFRESH_SECRET,
    namespace: 'refreshJwt',
    jwtVerify: 'refreshJwtVerify',
    jwtSign: 'refreshJwtSign',
});

fastify.register(fastifyOauth2, {
    name: 'googleOAuth2',
    scope: ['openid', 'email', 'profile'],
    credentials: {
        client: {
            id: process.env.GOOGLE_CLIENT_ID,
            secret: process.env.GOOGLE_CLIENT_SECRET,
        },
        // auth: fastifyOauth2.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: '/api/user/google/login',
    callbackUri: 'http://localhost:5000/api/user/google/callback',
    discovery: {
        issuer: 'https://accounts.google.com',
    },
});

const userRepo = new PostrgresUserRepository()
export const userService = new UserService(userRepo)
const userController = new UserControllers(userService)
fastify.register(userRoutes, { prefix: '/api/user', controller: userController });

const codeRepo = new PostgresCodeRepository()
export const codeService = new CodeService(codeRepo)

const tokenRepo = new PostgresTokenRepository()
export const tokenService = new TokenService(tokenRepo)
export const sessionController = new SessionController(tokenService)
fastify.register(sessionRoutes, { prefix: '/api/session', controller: sessionController});

const achievementRepo = new MongoAchievementRepository()
export const achievementService = new AchievementService(achievementRepo)
const achievementController = new AchievementController(achievementService)
fastify.register(achievementRoutes, { prefix: '/api/achievement', controller: achievementController });

const planRepo = new MongoPlanRepository()
export const planService = new PlanService(planRepo)
const planController = new PlanController(planService)
fastify.register(planRoutes, { prefix: '/api/plan', controller: planController});

fastify.setErrorHandler(errorHandler);

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL as string);
        await fastify.listen({ port: PORT }, () =>
            console.log(`Server run on port ${PORT}`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();

export { fastify };
