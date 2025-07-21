import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';


export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.replace('Bearer', '').trim();

  if (!token || token === 'null' || token.trim() === '') {
    return res.status(403).json({ error: 'Invalid token' });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!, { algorithms: ['HS256'] });
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: 'Unauthorized or expired token' });
  }
};
