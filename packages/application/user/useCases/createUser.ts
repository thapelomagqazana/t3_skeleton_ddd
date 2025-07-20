import { IUserRepository } from '@domain/user/repositories/IUserRepository';
import { User } from '@domain/user/entities/User';
import { EmailAlreadyExistsError } from '@domain/user/errors/EmailAlreadyExistsError';
import { hashPassword } from '@services/auth/HashService';
import { Email } from '@domain/valueObjects/Email';

/**
 * Use case to create a new user account.
 */
export class CreateUser {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(input: { name: string; email: string; password: string; role?: string }) {
    const email = new Email(input.email);
    const existingUser = await this.userRepo.findByEmail(email.getValue());
    if (existingUser) {
      throw new EmailAlreadyExistsError(input.email);
    }

    const hashedPassword = await hashPassword(input.password);

    const user = new User(
      crypto.randomUUID(),
      input.name.trim(),
      email,
      hashedPassword,
      input.role === 'ADMIN' ? 'ADMIN' : 'USER'
    );

    return await this.userRepo.save(user);
  }
}