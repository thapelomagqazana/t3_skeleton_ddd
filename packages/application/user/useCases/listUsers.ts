import { IUserRepository } from '@domain/user/repositories/IUserRepository';

/**
 * Use case to return all users.
 */
export class ListUsers {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute() {
    return await this.userRepo.findAll();
  }
}
