/**
 * @file middleware/logging.ts
 * @description Middleware to log incoming requests (via morgan) and errors (via winston).
 */

import morgan from 'morgan';
import { logger } from '../utils/logger';
import { Request, Response, NextFunction } from 'express';

/**
 * Stream that redirects morgan logs to winston.
 */
const stream = {
  write: (message: string) => logger.info(message.trim()),
};

/**
 * Skip logging during tests to keep logs clean.
 */
const skip = () => process.env.NODE_ENV === 'test';

/**
 * Morgan middleware to log HTTP requests in a custom format.
 */
const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream, skip }
);

/**
 * Error-logging middleware for unhandled errors.
 * Logs full error stack and forwards the error to Express error handler.
 */
function errorLogger(err: Error, req: Request, res: Response, next: NextFunction) {
  logger.error(`Error: ${err.message}`, { stack: err.stack });
  next(err);
}

export { requestLogger, errorLogger };
