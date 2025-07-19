/**
 * @file user.controller.ts
 * @description Contains controller logic for User CRUD operations.
 */

import { Response, NextFunction } from 'express';
import prisma from '../../db';
import { Role } from '@prisma/client';
import { AppError } from '../../utils/AppError';
import { AuthRequest } from '../../middleware/auth.middleware';
import { UserIdParamSchema } from '../../schemas/userIdParam.schema';

/**
 * GET /api/users
 * Get all users
 */
export const getAllUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Check for role-based access
    if (req.user?.role !== Role.ADMIN) {
      throw new AppError('Forbidden: Admins only', 403);
    }

    // Extract and validate query params
    const { page = 1, limit = 10, role, active, search } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
      throw new AppError('Invalid pagination input', 400);
    }

    const where: any = {};

    if (role) {
      const normalizedRole = role.toString().toUpperCase();
      if (!Object.values(Role).includes(normalizedRole as Role)) {
        throw new AppError('Invalid role filter', 400);
      }
      where.role = normalizedRole as Role;
    }

    if (typeof active !== 'undefined') {
      if (active !== 'true' && active !== 'false') {
        throw new AppError('Invalid active filter', 400);
      }
      where.isActive = active === 'true';
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });

    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/:id
 * Get a user by ID
 */
export const getUserById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parseResult = UserIdParamSchema.safeParse(req.params);

  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid input',
      details: parseResult.error.flatten(), // ← Preferred for clean responses
    });
  }


  const requestedUserId = parseResult.data.id;
  const requester = req.user;

  if (!requester) {
    return next(new AppError('Unauthorized', 401));
  }

  const isSelf = requester.userId === requestedUserId;
  const isAdmin = requester.role === Role.ADMIN;

  if (!isSelf && !isAdmin) {
    return next(new AppError('Forbidden – You cannot access this user’s information', 403));
  }

  const user = await prisma.user.findUnique({ where: { id: requestedUserId } });

  if (!user) return next(new AppError('User not found', 404));

  res.json({ user });
};

/**
 * PUT /api/users/:id
 * Update user
 */
export const updateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parseResult = UserIdParamSchema.safeParse(req.params);

  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid input',
      details: parseResult.error.flatten(), // ← Preferred for clean responses
    });
  }

  const requestedUserId = parseResult.data.id;
  const { name, email, password, isActive, role } = req.body;

  const isAdmin = req.user?.role === Role.ADMIN;
  const isSelf = req.user?.userId === requestedUserId;

  if (!isAdmin && !isSelf) {
    return next(new AppError('Forbidden – You cannot access this user’s information', 403));
  }


  try {
    const user = await prisma.user.update({
      where: { id: requestedUserId },
      data: { name, email, password, isActive, role },
    });

    res.json({ user });
  } catch {
    next(new AppError('User update failed. Possibly email already taken.', 400));
  }
};

/**
 * DELETE /api/users/:id
 * Delete a user
 */
export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parseResult = UserIdParamSchema.safeParse(req.params);

  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid input',
      details: parseResult.error.flatten(), // ← Preferred for clean responses
    });
  }

  const requestedUserId = parseResult.data.id;

  const isAdmin = req.user?.role === Role.ADMIN;
  const isSelf = req.user?.userId === requestedUserId;

  if (!isAdmin && !isSelf) {
    return next(new AppError('Forbidden – You cannot access this user’s information', 403));
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: requestedUserId } });

    if (!user) return next(new AppError('User not found', 404));
    if (!user.isActive) return next(new AppError('User already deleted', 410));
 
    await prisma.user.update({
      where: { id: requestedUserId },
      data: { isActive: false},
    });
    return res.status(200).json({ message: 'User successfully deleted' });
  } catch {
    next(new AppError('User deletion failed', 400));
  }
};
