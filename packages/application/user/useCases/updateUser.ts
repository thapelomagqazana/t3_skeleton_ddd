import { IUserRepository } from '@domain/user/repositories/IUserRepository';
import { User } from '@domain/user/entities/User';

/**
 * Use case to update a user's details.
 */
export class UpdateUser {
  constructor(private readonly userRepo: IUserRepository) {}

    async execute(id: string, updates: Partial<Omit<User, 'id'>>) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      return null;
    }

    // Update using entity-level methods or direct mutation (if allowed in your model)
    if (updates.name) user.updateName(updates.name);
    if (updates.email) user.updateEmail(updates.email.getValue());
    if (updates.role) user.updateRole(updates.role);
    if (updates.isActive !== undefined) user.setActive(updates.isActive);

    return await this.userRepo.update(user);
  }
}

