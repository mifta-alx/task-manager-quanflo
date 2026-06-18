export const ERROR_CODES = {
    VALIDATION_TITLE_REQUIRED: { status: 400, message: 'Task title is required and cannot be empty' },
    VALIDATION_ACTOR_REQUIRED: { status: 400, message: 'Actor parameter is required to log changes' },
    VALIDATION_INVALID_STATUS_VALUE: { status: 400, message: 'Invalid status value provided' },
    VALIDATION_INVALID_TRANSITION_FLOW: { status: 400, message: 'Status transition violates business domain flow guidelines' },

    TASK_NOT_FOUND: { status: 404, message: 'Task not found' },
} as const;

export type AppErrorCode = keyof typeof ERROR_CODES;

export class AppError extends Error {
    public readonly statusCode: number;

    constructor(code: AppErrorCode) {
        const errorConfig = ERROR_CODES[code];
        super(errorConfig.message);
        this.name = 'AppError';
        this.statusCode = errorConfig.status;

        Error.captureStackTrace(this, this.constructor);
    }
}