import { z } from 'zod';

/**
 * Schema to validate user ID route parameter
 * Ensures the ID is a valid UUID (v4 or general)
 */
export const UserIdParamSchema = z.object({
  id: z.string().trim().uuid('Invalid user ID format').toLowerCase(),
});

export type UserIdParamInput = z.infer<typeof UserIdParamSchema>;
