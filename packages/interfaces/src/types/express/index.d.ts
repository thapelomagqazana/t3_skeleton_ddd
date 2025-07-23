import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: Role;
        email?: string; // optional if not always embedded in token
      };
    }
  }
}

export {}; // important to mark this file as a module
