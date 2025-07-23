import { IUserRepository } from '@domain/user/repositories/IUserRepository';
import { User } from '@domain/user/entities/User';
/**
 * Implements IUserRepository using Prisma ORM.
 */
export declare class UserRepository implements IUserRepository {
    findAll({ role, active, search, page, limit, }?: {
        role?: string;
        active?: string | boolean;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<User[]>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    save(user: User): Promise<User>;
    update(user: User): Promise<User>;
    delete(id: string): Promise<false | 'alreadyDeleted' | 'deleted'>;
}
