import { IUserRepository } from '@domain/user/repositories/IUserRepository';

/**
 * Use case to fetch user by ID.
 */
export class GetUser {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(id: string) {
    return await this.userRepo.findById(id);
  }
}
