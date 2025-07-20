/**
 * @file auth.middleware.ts
 * @description Express middleware to authenticate JWT tokens.
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

/**
 * Middleware to protect routes using JWT.
 */
export function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers?.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - Token missing or invalid scheme' });
  }

  const token = authHeader.replace('Bearer', '').trim();

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Token empty' });
  }

  try {
    const decoded = verifyToken<{ userId: string, role: string }>(token);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: 'Forbidden - Invalid or expired token' });
  }
}

