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
    logout: {
        body: {
            type: 'object',
            required: ['refreshToken'],
            properties: {
                refreshToken: {type: 'string'}
            }
        },
        response: {
            200: messageResponse,
            default: anyError
        }
    },
    refresh: {
        body: {
            type: 'object',
            required: ['refreshToken'],
            properties: {
                refreshToken: {type: 'string'}
            }
        },
        response: {
            200: tokensDto,
            default: anyError
        }
    }
}