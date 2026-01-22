require('dotenv').config();

const Fastify = require('fastify');
import jwt from '@fastify/jwt';
import fastifyOauth2 from '@fastify/oauth2';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import oauthRoutes from './routes/oauthRoutes';
import errorHandler from './middlewares/errorHandler';
import sessionRoutes from './routes/sessionRoutes';
import goalRoutes from './routes/goalRoutes';
import balanceRoutes from './routes/balanceRoutes';
import achievementRoutes from './routes/achievementRoutes';

const PORT = Number(process.env.PORT) || 5000;

const fastify = Fastify({
    // logger: true,
    logger: { level: 'trace' },
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
    startRedirectPath: '/api/oauth/google/login',
    callbackUri: 'http://localhost:5000/api/oauth/google/callback',
    discovery: {
        issuer: 'https://accounts.google.com',
    },
});

fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(oauthRoutes, { prefix: '/api/oauth' });
fastify.register(sessionRoutes, { prefix: '/api/session' });
fastify.register(goalRoutes, { prefix: '/api/goal' });
fastify.register(balanceRoutes, { prefix: '/api/balance' });
fastify.register(achievementRoutes, { prefix: '/api/achievement' });
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
