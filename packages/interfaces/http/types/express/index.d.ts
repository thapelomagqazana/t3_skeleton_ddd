import { User } from '@domain/user/entities/User';

declare global {
  namespace Express {
    interface Request {
      user?: User; // or a token payload type if using JWT
    }
  }
}