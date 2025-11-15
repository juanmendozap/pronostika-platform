import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface CustomError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { statusCode = 500, message } = err;

  logger.error({
    statusCode,
    message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Don't leak error details in production
  const response = process.env.NODE_ENV === 'production' 
    ? { error: statusCode === 500 ? 'Internal Server Error' : message }
    : { error: message, stack: err.stack };

  res.status(statusCode).json({
    success: false,
    ...response
  });
};

export const createError = (message: string, statusCode: number = 500): CustomError => {
  const error: CustomError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};