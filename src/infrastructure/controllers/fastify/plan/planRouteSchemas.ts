const anyError = {
    type: 'object', 
    properties: {
        statusCode: {type: 'number'},
        error: {type: 'string'},
        message: {type: 'string'},
    }
}

const taskEntity = {
    type: 'object', 
    properties: {
        id: {type: 'string'},
        task: {type: 'string'},
        isDone: {type: 'boolean'}
    }
}

const planEntity = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            id: {type: 'string'},
            userId: {type: 'string'},
            plan: {
                type: 'array',
                items: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: {type: 'string'},
                            task: {type: 'string'},
                            isDone: {type: 'boolean'}
                        }
                    }
                }
            }
        }
    }
}

const questions = {
    type: 'object',
    properties: {
        goal: {type: 'string'},
        questions: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    question: {type: 'string'},
                    options: {
                        type: 'array',
                        items: {type: 'string'}
                    }
                }
            }
        }
    }
}

export default {
    create: {
        security: [{ bearerAuth: [] }],
        body: {
            type: 'object',
            required: ['goal'],
            properties: {
                goal: {type: 'string'}
            }
        },
        response: {
            200: questions,
            default: anyError
        }

    },
    getPlans: {
        security: [{ bearerAuth: [] }],
        response: {
            200: planEntity,
            default: anyError
        }

    },
    complete: {
        security: [{ bearerAuth: [] }],
        body: {
            type: 'object',
            required: ['taskId'],
            properties: {
                taskId: {type: 'string'}
            }
        },
        response: {
            200: taskEntity,
            default: anyError
        }
    },
    uncomplete: {
        security: [{ bearerAuth: [] }],
        body: {
            type: 'object',
            required: ['taskId'],
            properties: {
                taskId: {type: 'string'}
            }
        },
        response: {
            200: taskEntity,
            default: anyError
        }
    },
    deletePlan: {
        security: [{ bearerAuth: [] }],
        body: {
            type: 'object',
            required: ['planId'],
            properties: {
                planId: {type: 'string'}
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    message: {type: 'string'}
                }
            },
            default: anyError
        }
    }
}