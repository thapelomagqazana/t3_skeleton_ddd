import { IUserRepository } from '@domain/user/repositories/IUserRepository';
/**
 * Use case to authenticate a user by email and password.
 */
export declare class AuthUser {
    private readonly userRepo;
    constructor(userRepo: IUserRepository);
    execute(email: string, password: string): Promise<import("../../../../domain/src/user/entities/User").User>;
}
