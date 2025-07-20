import { IUserRepository } from '@domain/user/repositories/IUserRepository';
import { comparePasswords } from '@services/auth/HashService';

/**
 * Use case to authenticate a user by email and password.
 */
export class AuthUser {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    return user;
  }
}
