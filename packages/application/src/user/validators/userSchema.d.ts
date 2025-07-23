import { z } from 'zod';
export declare const SignupSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strict>;
export declare const userIdSchema: z.ZodString;
export declare const updateUserSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
