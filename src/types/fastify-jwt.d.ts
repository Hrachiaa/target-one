import '@fastify/jwt';

declare module '@fastify/jwt' {
    // твой shape payload/user (подправь при необходимости)
    interface FastifyJWT {
        payload: { id: string; email?: string }; // то, что ты sign'ишь
        user: { id: string; email?: string }; // то, что получишь после verify
    }
}

declare module 'fastify' {
    interface FastifyRequest {
        accessJwtVerify<T = import('@fastify/jwt').FastifyJWT['user']>(
            options?: import('@fastify/jwt').VerifyOptions
        ): Promise<T>;
        refreshJwtVerify<T = import('@fastify/jwt').FastifyJWT['user']>(
            options?: import('@fastify/jwt').VerifyOptions
        ): Promise<T>;

        accessJwtSign(
            payload: object,
            options?: import('@fastify/jwt').SignOptions
        ): string | Promise<string>;
        refreshJwtSign(
            payload: object,
            options?: import('@fastify/jwt').SignOptions
        ): string | Promise<string>;
    }

    interface FastifyInstance {
        accessJwt: {
            sign(
                payload: object,
                options?: import('@fastify/jwt').SignOptions
            ): string;
            verify<T = import('@fastify/jwt').FastifyJWT['user']>(
                token: string,
                options?: import('@fastify/jwt').VerifyOptions
            ): T;
        };
        refreshJwt: {
            sign(
                payload: object,
                options?: import('@fastify/jwt').SignOptions
            ): string;
            verify<T = import('@fastify/jwt').FastifyJWT['user']>(
                token: string,
                options?: import('@fastify/jwt').VerifyOptions
            ): T;
        };
    }
}
