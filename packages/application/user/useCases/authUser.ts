import { IUserRepository } from '@domain/user/repositories/IUserRepository';
import { comparePasswords } from '@services/auth/HashService';
import { InvalidCredentialsError } from '@domain/user/errors/InvalidCredentialsError';

/**
 * Use case to authenticate a user by email and password.
 */
export class AuthUser {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.userRepo.findByEmail(normalizedEmail);
    if (!user) throw new InvalidCredentialsError();

    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) throw new InvalidCredentialsError();

    return user;
  }
}
