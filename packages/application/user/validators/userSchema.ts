import { z } from 'zod';

export const SignupSchema = z
  .object({
    name: z.string().trim().min(2),
    email: z.string().trim().email(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  })
  .strict();