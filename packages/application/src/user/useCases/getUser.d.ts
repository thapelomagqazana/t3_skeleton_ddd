import { IUserRepository } from '@domain/user/repositories/IUserRepository';
/**
 * Use case to fetch user by ID.
 */
export declare class GetUser {
    private readonly userRepo;
    constructor(userRepo: IUserRepository);
    execute(id: string): Promise<import("../../../../domain/src/user/entities/User").User | null>;
}
