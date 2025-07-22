import { z } from 'zod';
import { Role } from '@prisma/client';

export const SignupSchema = z
  .object({
    name: z.string().trim().min(2),
    email: z.string().trim().email(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  })
  .strict();

export const userIdSchema = z.string().trim().uuid('Invalid user ID format').toLowerCase();

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(1, 'Name cannot be empty').optional(),
    email: z.string().email('Invalid email format').optional(),
    role: z
      .string()
      .trim()
      .transform(val => val.toUpperCase())
      .refine(val => Object.values(Role).includes(val as Role), {
        message: 'Invalid role',
      })
      .optional(),
    isActive: z.boolean().optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
});