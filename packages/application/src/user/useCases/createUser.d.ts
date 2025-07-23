import { IUserRepository } from '@domain/user/repositories/IUserRepository';
import { User } from '@domain/user/entities/User';
/**
 * Use case to create a new user account.
 */
export declare class CreateUser {
    private readonly userRepo;
    constructor(userRepo: IUserRepository);
    execute(input: {
        name: string;
        email: string;
        password: string;
        role?: string;
    }): Promise<User>;
}
