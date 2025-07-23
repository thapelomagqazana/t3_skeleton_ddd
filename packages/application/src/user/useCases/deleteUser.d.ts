import { IUserRepository } from '@domain/user/repositories/IUserRepository';
/**
 * Use case to soft-delete a user.
 */
export declare class DeleteUser {
    private readonly userRepo;
    constructor(userRepo: IUserRepository);
    execute(id: string): Promise<false | "alreadyDeleted" | "deleted">;
}
