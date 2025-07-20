/**
 * @file utils/logger.ts
 * @description Centralized Winston logger with colored logs in development and file rotation in production.
 */

import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const isDev = process.env.NODE_ENV === 'development';

const devFormat = format.combine(
  format.colorize(), // ← Adds color
  format.timestamp({ format: 'HH:mm:ss' }),
  format.printf(({ timestamp, level, message, stack }) =>
    stack
      ? `${timestamp} ${level}: ${message}\n${stack}`
      : `${timestamp} ${level}: ${message}`
  )
);

const prodFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.printf(({ timestamp, level, message, stack }) =>
    stack
      ? `[${timestamp}] ${level}: ${message}\n${stack}`
      : `[${timestamp}] ${level}: ${message}`
  )
);

/**
 * Winston logger with environment-aware formats.
 */
export const logger = createLogger({
  level: 'info',
  format: isDev ? devFormat : prodFormat,
  transports: [
    // Console: colored for dev
    new transports.Console(),

    // File: only used in production mode
    ...(isDev
      ? []
      : [
          new DailyRotateFile({
            filename: 'logs/app-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '10m',
            maxFiles: '14d',
            zippedArchive: true,
          }),
        ]),
  ],
  exitOnError: false,
});
