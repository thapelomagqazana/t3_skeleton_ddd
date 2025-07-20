import { Request, Response } from 'express';
import prisma from '../db';

export const resetUsers = async (req: Request, res: Response) => {
  const { emails } = req.body; // Expecting an array

  if (!Array.isArray(emails)) {
    return res.status(400).json({ message: 'Invalid email list' });
  }

  await prisma.user.deleteMany({
    where: {
      email: { in: emails },
    },
  });

  res.status(200).json({ message: 'Reset successful' });
};
