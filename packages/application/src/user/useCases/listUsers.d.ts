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
export declare class ListUsers {
    private readonly userRepo;
    constructor(userRepo: IUserRepository);
    execute(options?: ListUsersOptions): Promise<import("../../../../domain/src/user/entities/User").User[]>;
}
export {};
