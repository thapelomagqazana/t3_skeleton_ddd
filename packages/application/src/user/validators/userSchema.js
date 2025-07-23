"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.userIdSchema = exports.SignupSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.SignupSchema = zod_1.z
    .object({
    name: zod_1.z.string().trim().min(2),
    email: zod_1.z.string().trim().email(),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
})
    .strict();
exports.userIdSchema = zod_1.z.string().trim().uuid('Invalid user ID format').toLowerCase();
exports.updateUserSchema = zod_1.z
    .object({
    name: zod_1.z.string().trim().min(1, 'Name cannot be empty').optional(),
    email: zod_1.z.string().email('Invalid email format').optional(),
    role: zod_1.z
        .string()
        .trim()
        .transform(val => val.toUpperCase())
        .refine(val => Object.values(client_1.Role).includes(val), {
        message: 'Invalid role',
    })
        .optional(),
    isActive: zod_1.z.boolean().optional(),
})
    .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
});
