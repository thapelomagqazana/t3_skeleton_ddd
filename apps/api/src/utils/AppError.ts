/**
 * @file AppError.ts
 * @description Defines a custom application error with a consistent format.
 */

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  /**
   * Creates a new AppError instance.
   * 
   * @param message - The error message
   * @param statusCode - HTTP status code
   */
  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true;

    // Capture the stack trace and exclude constructor
    Error.captureStackTrace(this, this.constructor);
  }
}
