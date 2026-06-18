import type { Request, Response, NextFunction } from 'express';
import { AppError } from '#config/errors.js';
import {Error} from "#utils/responseHelper.js";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof AppError) {
        return Error(res, err.message, err.statusCode);
    }

    return Error(res, "Internal server error", 500);
};