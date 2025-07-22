import { IUserRepository } from '@domain/user/repositories/IUserRepository';

interface ListUsersOptions {
  role?: string;
  active?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Use case to return all users.
 */
export class ListUsers {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(options: ListUsersOptions = {}) {
    return await this.userRepo.findAll(options);
  }
}
