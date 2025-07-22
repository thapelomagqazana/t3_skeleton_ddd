import { Request, Response } from 'express';
import { UserRepository } from '@infrastructure/db/UserRepository';
import { ListUsers } from '@application/user/useCases/listUsers';
import { GetUser } from '@application/user/useCases/getUser';
import { UpdateUser } from '@application/user/useCases/updateUser';
import { DeleteUser } from '@application/user/useCases/deleteUser';
import { User } from '@domain/user/entities/User';

const repo = new UserRepository();

export const getUsers = async (req: Request, res: Response) => {
  try {
    // Access control check
    const currentUser = req.user as User;
    if (currentUser.role !== 'ADMIN') {
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
  const useCase = new GetUser(repo);
  const user = await useCase.execute(req.params.id);
  res.status(user ? 200 : 404).json(user || { error: 'User not found' });
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
