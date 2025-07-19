import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '@prisma/client';

export const generateToken = (user: User, expiresIn: string = '1h'): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  const payload = {
    userId: user.id,
    role: user.role,
  };

  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, secret, options);
};
