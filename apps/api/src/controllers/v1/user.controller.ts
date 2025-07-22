import { Request, Response } from 'express';
import { UserRepository } from '@infrastructure/db/UserRepository';
import { ListUsers } from '@application/user/useCases/listUsers';
import { GetUser } from '@application/user/useCases/getUser';
import { UpdateUser } from '@application/user/useCases/updateUser';
import { DeleteUser } from '@application/user/useCases/deleteUser';
import { Role } from '@prisma/client';
import { Email } from '@domain/valueObjects/Email';
import { userIdSchema, updateUserSchema } from '@application/user/validators/userSchema';

const repo = new UserRepository();
// UUID v4 validation schema


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

  try {
    const rawId = req.params.id?.trim();

    // Validate UUID format
    const idResult = userIdSchema.safeParse(rawId);
    if (!idResult.success) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    const id = idResult.data;

    // Validate request body
    const bodyResult = updateUserSchema.safeParse(req.body);
    if (!bodyResult.success) {
      return res.status(400).json({ errors: bodyResult.error.issues });
    }

    // Transform & hydrate domain object
    const { name, email, role, isActive } = bodyResult.data;
    const updatePayload: any = {};
    if (name) updatePayload.name = name.trim();
    if (email) updatePayload.email = new Email(email); // domain VO
    if (role) updatePayload.role = role;
    if (isActive !== undefined) updatePayload.isActive = isActive;

    // Only allow self-update or admin
    const currentUser = req.user!;
    if (currentUser.role !== Role.ADMIN && currentUser.userId !== id) {
      return res.status(403).json({ error: 'Forbidden: Cannot update another user' });
    }

    // Run use case
    const result = await useCase.execute(id, updatePayload);
    if (!result) {
      return res.status(400).json({ error: 'User update failed or user not found' });
    }

    return res.status(200).json({ user: result });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Server error during user update' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id?.trim();

    // Validate ID
    const parseResult = userIdSchema.safeParse(id);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const currentUser = req.user!;
    const isAdmin = currentUser.role === 'ADMIN';
    const isSelf = currentUser.userId === id;

    if (!isAdmin && !isSelf) {
      return res.status(403).json({ error: 'Forbidden: You cannot delete another user' });
    }

    const useCase = new DeleteUser(repo);
    const result = await useCase.execute(id);

    if (result === false) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (result === 'alreadyDeleted') {
      return res.status(410).json({ error: 'User already deleted' });
    }

    // You can adjust the message depending on soft or hard delete
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Server error during user deletion' });
  }
};

