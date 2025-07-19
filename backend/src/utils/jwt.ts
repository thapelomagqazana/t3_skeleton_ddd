/**
 * @file jwt.ts
 * @description Utility functions for signing and verifying JWT tokens.
 */

import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

/**
 * Signs a JWT token with the given payload.
 * @param payload - The object to sign into the token.
 * @param expiresIn - Token expiration time (e.g., '1h', '7d').
 * @returns Signed JWT token.
 */
export function signToken(payload: object, expiresIn: string = '1h'): string {
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, JWT_SECRET, options);
}

/**
 * Verifies a JWT token and returns the decoded payload.
 * @param token JWT token string.
 * @returns Decoded payload if valid; throws if invalid.
 */
export function verifyToken<T>(token: string): T {
  return jwt.verify(token, JWT_SECRET) as T;
}
