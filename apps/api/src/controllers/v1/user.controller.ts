import { Request, Response } from 'express';
import { UserRepository } from '@infrastructure/db/UserRepository';
import { ListUsers } from '@application/user/useCases/listUsers';
import { GetUser } from '@application/user/useCases/getUser';
import { UpdateUser } from '@application/user/useCases/updateUser';
import { DeleteUser } from '@application/user/useCases/deleteUser';
import { Role } from '@prisma/client';
import { User } from '@domain/user/entities/User';
import z from 'zod';

const repo = new UserRepository();
// UUID v4 validation schema
const userIdSchema = z.string().uuid();

export const getUsers = async (req: Request, res: Response) => {
  try {
    // Access control check
    const currentUser = req.user;
    if (currentUser?.role !== Role.ADMIN) {
      return res.status(403).json({ error: { message: 'Forbidden: Admins only' } });
    }

    // Pagination validation
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({ error: { message: 'Invalid pagination input' } });
    }

    const useCase = new ListUsers(repo);
    const users = await useCase.execute({
      page,
      limit,
      role: req.query.role as string,
      search: req.query.search as string,
      active:
        req.query.active !== undefined
          ? req.query.active === 'true'
          : undefined,
    });

    res.status(200).json({ users });
  } catch (err) {
    console.error('[getUsers Controller] ❌', err);
    res.status(500).json({ error: { message: 'Internal Server Error' } });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user;
    console.log(currentUser);
    const rawId = req.params.id?.trim();

    // Validate UUID format
    const parseResult = userIdSchema.safeParse(rawId);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    const id = parseResult.data;

    // Authorization: user must be ADMIN or requesting their own ID
    if (currentUser?.role !== Role.ADMIN && currentUser?.userId !== id) {
      return res.status(403).json({ error: 'Forbidden: Access denied' });
    }

    // Use case logic
    const useCase = new GetUser(repo);
    const user = await useCase.execute(id);

    if (user) {
      return res.status(200).json({ user });
    } else {
      return res.status(404).json({ error: 'User not found' });
    }

  } catch (err) {
    console.error('[getUserById Controller] ❌', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const useCase = new UpdateUser(repo);
  const user = new User(req.params.id, req.body.name, req.body.email, req.body.password, req.body.role);
  const updated = await useCase.execute(user);
  res.status(200).json(updated);
};

export const deleteUser = async (req: Request, res: Response) => {
  const useCase = new DeleteUser(repo);
  await useCase.execute(req.params.id);
  res.status(204).send();
};
