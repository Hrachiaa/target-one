import { any, nullable } from "zod";

const tokensDto = {
    type: 'object', 
    properties: {
        user: {
            type: 'object',
            properties: {
                id: {type: 'string'},
                email: {type: 'string'},
                googleId: {type: 'string', nullable: true}
            }
        },
        accessToken: {type: 'string'},
        refreshToken: {type: 'string'}
    }
}

const messageResponse = {
    type: 'object',
    properties: {
        message: {type: 'string'}
    }
}

const anyError = {
    type: 'object', 
    properties: {
        statusCode: {type: 'number'},
        error: {type: 'string'},
        message: {type: 'string'},
    }
}

export default {
    auth: {
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
        response: {
            200: tokensDto,
            default: anyError
        },
    },
    forgotPass: {
        body: {
            type: 'object',
            required: ['email'],
            properties: {
                email: { type: 'string', format: 'email' },
            },
            additionalProperties: false,
        },
        response: {
            200: messageResponse,
            default: anyError
        }
    },
    checkResetCode: {
        body: {
            type: 'object',
            required: ['email', 'code'],
            properties: {
                email: { type: 'string', format: 'email' },
                code: { type: 'string', minLength: 4, maxLength: 4 },
            },
            additionalProperties: false,
        },
        response: {
            200: messageResponse,
            default: anyError
        }
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
        response: {
            200: messageResponse,
            default: anyError
        }
    },
    changePassword: {
        security: [{ bearerAuth: [] }],
        body: {
            type: 'object',
            required: ['oldPassword', 'newPassword'],
            properties: {
                oldPassword: {type: 'string', minLength: 8, maxLength: 64},
                newPassword: {type: 'string', minLength: 8, maxLength: 64}
            }
        },
        response: {
            200: messageResponse,
            default: anyError
        }
    },
    confirmEmail: {
        security: [{ bearerAuth: [] }],
        response: {
            200: messageResponse,
            default: anyError
        }
    }, 
    deleteUser: {
        security: [{ bearerAuth: [] }],
        response: {
            200: messageResponse,
            default: anyError
        }
    }, 
    balance: {
        security: [{ bearerAuth: [] }],
        response: {
            200: {
                type: 'object',
                required: ['balance'],
                properties: {
                    balance: {type: 'number'}
                }
            },
            default: anyError
        }
    }, 
    checkConfirmCode: {
        security: [{ bearerAuth: [] }],
        body: {
            required: ['code'],
            type: 'object',
            properties: {
                code: {type: 'string', minLength: 4, maxLength: 4}
            }
        },
        response: {
            200: messageResponse,
            default: anyError
        }
    }
};
