const anyError = {
    type: 'object', 
    properties: {
        statusCode: {type: 'number'},
        error: {type: 'string'},
        message: {type: 'string'},
    }
}

const achievementItem = {
    type: 'object',
    properties: {
        id: {type: 'string'},
        achievementName: {type: 'string'},
        icon: {type: 'string'},
        price: {type: 'number'},
        isUnlocked: {type: 'boolean'},
    }
}

const achievementsEntity = {
    type: 'object', 
    properties: {
        id: {type: 'string'},
        userId: {type: 'string'},
        achievements: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: {type: 'string'},
                    achievementName: {type: 'string'},
                    icon: {type: 'string'},
                    price: {type: 'number'},
                    isUnlocked: {type: 'boolean'},
                }
            }
        }
    }
}

const userEntity = {
    type: 'object',
    properties: {
        id: {type: 'string'},
        email: {type: 'string'},
        emailVerified: {type: 'boolean'},
        googleId: {type: 'string', nullable: true},
        password: {type: 'string', nullable: true},
        balance: {type: 'number'},
        avatar: {type: 'string'}
    }
}

export default {
    getAchievements: {
        security: [{ bearerAuth: [] }],
        response: {
            200: achievementsEntity,
            default: anyError
        }
    },
    unlockAchievement: {
        security: [{ bearerAuth: [] }],
        body: {
            type: 'object',
            required: ['achievementId'],
            properties: {
                achievementId: {type: 'string'}
            }
        },
        response: {
            200: achievementItem,
            default: anyError
        }
    },
    setAvatar: {
        security: [{ bearerAuth: [] }],
        body: {
            type: 'object',
            required: ['achievementId'],
            properties: {
                achievementId: {type: 'string'}
            }
        },
        response: {
            200: userEntity,
            default: anyError
        }
    }
}