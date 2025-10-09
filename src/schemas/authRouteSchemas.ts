export default {
    authSchema: {
        body: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
                email: { type: 'string', format: 'email' },
                password: {
                    type: 'string',
                    minLength: 8, // минимум 8 символов
                    maxLength: 64,
                },
            },
            additionalProperties: false,
        },
    },
    forgotPassSchema: {
        body: {
            type: 'object',
            required: ['email'],
            properties: {
                email: { type: 'string', format: 'email' },
            },
            additionalProperties: false,
        },
    },
    checkCode: {
        body: {
            type: 'object',
            required: ['email', 'code'],
            properties: {
                email: { type: 'string', format: 'email' },
                code: { type: 'string', minLength: 4, maxLength: 4 },
            },
            additionalProperties: false,
        },
    },
    reset: {
        body: {
            type: 'object',
            required: ['email', 'code', 'password'],
            properties: {
                email: { type: 'string', format: 'email' },
                code: { type: 'string', minLength: 4, maxLength: 4 },
                password: { type: 'string', minLength: 8, maxLength: 64 },
            },
            additionalProperties: false,
        },
    },
    getRefreshSchema: {
        body: {
            type: 'object',
            required: ['refreshToken'],
            properties: {
                refreshToken: { type: 'string' },
            },
            additionalProperties: false,
        },
    },
};
