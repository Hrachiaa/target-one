require('dotenv').config();

const Fastify = require('fastify');
import jwt from '@fastify/jwt';
import fastifyOauth2 from '@fastify/oauth2';
import mongoose from 'mongoose';
import userRoutes from './infrastructure/controllers/user/userRoutes';
import errorHandler from './middlewares/errorHandler';
import goalRoutes from './routes/goalRoutes';
import balanceRoutes from './routes/balanceRoutes';
import achievementRoutes from './routes/achievementRoutes';
import {MongoUserRepository} from './infrastructure/db/mongoDB/user/MongoUserRepository';
import UserService from './domain/user/UserService';
import UserControllers from './infrastructure/controllers/user/UserController';
import sessionRoutes from './infrastructure/controllers/session/sessionRoutes';
import { MongoTokenRepository } from './infrastructure/db/mongoDB/token/MongoTokenRepository';
import { TokenService } from './domain/token/TokenService';
import SessionController from './infrastructure/controllers/session/SessionController';

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

const userRepo = new MongoUserRepository()
export const userService = new UserService(userRepo)
const userController = new UserControllers(userService)
fastify.register(userRoutes, { prefix: '/api/user', controller: userController });

const tokenRepo = new MongoTokenRepository()
export const tokenService = new TokenService(tokenRepo)
export const sessionController = new SessionController(tokenService)
fastify.register(sessionRoutes, { prefix: '/api/session', controller: sessionController});

// fastify.register(goalRoutes, { prefix: '/api/goal' });
// fastify.register(balanceRoutes, { prefix: '/api/balance' });
// fastify.register(achievementRoutes, { prefix: '/api/achievement' });
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
