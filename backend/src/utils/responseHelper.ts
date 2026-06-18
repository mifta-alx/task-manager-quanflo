import type { Response } from 'express';

export const Success = (res: Response, data: unknown, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

export const Error = (res: Response, errorMessage: string, statusCode = 500) => {
    return res.status(statusCode).json({
        success: false,
        error: errorMessage,
    });
};