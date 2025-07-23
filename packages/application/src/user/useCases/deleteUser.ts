import { IUserRepository } from '@domain/user/repositories/IUserRepository';

/**
 * Use case to soft-delete a user.
 */
export class DeleteUser {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(id: string) {
    return await this.userRepo.delete(id);
  }
}
