import bcrypt from 'bcrypt';

/**
 * Hashes a plain text password
 */
export const hashPassword = (plain: string): Promise<string> =>
  bcrypt.hash(plain, 10);

/**
 * Compares plain password with hashed password
 */
export const comparePasswords = (plain: string, hash: string): Promise<boolean> =>
  bcrypt.compare(plain, hash);