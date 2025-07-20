/**
 * @file user.schema.ts
 * @description Zod schemas for user-related input validation (signup and signin).
 */

import { z } from 'zod';
import { Role } from '@prisma/client';



/**
 * Schema for validating user signup data.
 * - name: required string
 * - email: must be a valid email
 * - password: must be at least 6 characters
 */
export const SignUpSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(50),
  email: z.string().toLowerCase().trim().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
.strict(); // If Zod is configured with `.strict()`, extra unknown fields will throw an error


/**
 * Schema for validating user signin data.
 * - email: must be a valid email
 * - password: must be at least 6 characters
 */
export const SignInSchema = z.object({
  email: z.string().toLowerCase().trim().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
.strict(); // If Zod is configured with `.strict()`, extra unknown fields will throw an error

// User Update Schema (for PUT /api/v1/users/:id)
export const UpdateUserSchema = z.object({
  name: z.string().trim().min(1).max(50).optional(),
  email: z.string().toLowerCase().trim().email('Invalid email').optional(),
  password: z.string().min(6).optional(),
  isActive: z.boolean().optional(),
  role: z.enum([Role.ADMIN, Role.USER]).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update.',
}).strict();

/**
 * @swagger
 * components:
 *   schemas:
 *     SignUpInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: MySecurePassword123
 *     SignInInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: MySecurePassword123
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "6f1b0c30-52aa-4d32-a69f-1f7393eaa5b5"
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-05T14:30:00Z"
 *     UpdateUserInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Updated Name
 *         email:
 *           type: string
 *           format: email
 *           example: updated@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: NewSecurePassword123
 *
 */

export type SignUpInput = z.infer<typeof SignUpSchema>;
export type SignInInput = z.infer<typeof SignInSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

