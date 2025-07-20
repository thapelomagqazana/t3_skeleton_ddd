/**
 * @file validate.ts
 * @description Middleware for validating request body against a Zod schema.
 */

import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * Middleware generator for validating request body using a Zod schema.
 *
 * @param schema - The Zod schema to validate against
 * @returns Express middleware function
 */
export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    // If validation fails, return 400 with detailed error
    if (!result.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: result.error.format(),
      });
    }

    // Replace body with validated and parsed data
    req.body = result.data;
    next();
  };
