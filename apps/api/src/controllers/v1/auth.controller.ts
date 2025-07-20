import { Request, Response } from 'express';
import { CreateUser } from '@application/user/useCases/createUser';
import { AuthUser } from '@application/user/useCases/authUser';
import { UserRepository } from '@infrastructure/db/UserRepository';
import { generateToken } from '@services/auth/JWTService';
import { SignupSchema } from '@application/user/validators/userSchema';
import { SignInSchema } from '@application/user/validators/authSchema';
import { EmailAlreadyExistsError } from '@domain/user/errors/EmailAlreadyExistsError';
import { InvalidCredentialsError } from '@domain/user/errors/InvalidCredentialsError';

const repo = new UserRepository();

export const signup = async (req: Request, res: Response) => {
  const result = SignupSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten() });
  }

  const data = result.data;
  try {
    const useCase = new CreateUser(repo);
    const user = await useCase.execute(data);
    const token = generateToken({ id: user.id, email: user.email });
    res.status(201).json({ user, token });
  } catch (err: any) {

    if (err instanceof EmailAlreadyExistsError) {
      return res.status(409).json({ error: { message: err.message } });
    }
    const error = err as Error;
    res.status(400).json({ error: error.message });
  }
};

export const signin = async (req: Request, res: Response) => {
  const result = SignInSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten() });
  }

  const data = result.data;
  try {
    const useCase = new AuthUser(repo);
    const user = await useCase.execute(data.email, data.password);
    const token = generateToken({ id: user.id, email: user.email });
    res.status(200).json({ user, token });
  } catch (err: any) {
    if (err instanceof InvalidCredentialsError) {
      return res.status(401).json({ error: { message: err.message } });
    }
    const error = err as Error;
    res.status(400).json({ error: error.message });
  }
};

export const signout = async (_: Request, res: Response) => {
  res.status(200).json({ message: 'Signed out' }); // or handle token revocation
};
