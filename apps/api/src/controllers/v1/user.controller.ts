import { Request, Response } from 'express';
import { UserRepository } from '@infrastructure/db/UserRepository';
import { ListUsers } from '@application/user/useCases/listUsers';
import { GetUser } from '@application/user/useCases/getUser';
import { UpdateUser } from '@application/user/useCases/updateUser';
import { DeleteUser } from '@application/user/useCases/deleteUser';
import { User } from '@domain/user/entities/User';

const repo = new UserRepository();

export const getUsers = async (_: Request, res: Response) => {
  const useCase = new ListUsers(repo);
  const users = await useCase.execute();
  res.status(200).json(users);
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
