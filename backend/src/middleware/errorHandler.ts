/**
 * @file errorHandler.ts
 * @description Global error-handling middleware for consistent API error formatting.
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

/**
 * Global error handler middleware.
 * 
 * @param err - The error object (can be AppError or generic Error)
 * @param req - Express Request
 * @param res - Express Response
 * @param next - Express NextFunction
 */
export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Something went wrong';
  let details: string | undefined;

  // Check if it's a known operational AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else {
    // For unexpected errors, optionally log stack trace
    console.error('[Unhandled Error]', err.stack);
    details = err.message;
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && details ? { details } : {}),
    },
  });
};
