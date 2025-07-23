import { IUserRepository } from '@domain/user/repositories/IUserRepository';
import { User } from '@domain/user/entities/User';
/**
 * Use case to update a user's details.
 */
export declare class UpdateUser {
    private readonly userRepo;
    constructor(userRepo: IUserRepository);
    execute(id: string, updates: Partial<Omit<User, 'id'>>): Promise<User | null>;
}
