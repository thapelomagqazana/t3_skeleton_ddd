import { User } from '@domain/user/entities/User';
export declare class UserMapper {
    static toPersistence(user: User): {
        id: string;
        name: string;
        email: string;
        password: string;
        role: "ADMIN" | "USER";
        isActive: boolean;
        createdAt: Date;
    };
    static toDomain(raw: any): User;
}
