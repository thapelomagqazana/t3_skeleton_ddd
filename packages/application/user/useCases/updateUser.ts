import { IUserRepository } from '@domain/user/repositories/IUserRepository';
import { User } from '@domain/user/entities/User';

/**
 * Use case to update a user's details.
 */
export class UpdateUser {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(user: User) {
    return await this.userRepo.update(user);
  }
}
