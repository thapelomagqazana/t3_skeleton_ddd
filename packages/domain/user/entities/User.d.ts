/**
 * Domain Entity representing a User in the system.
 */
export declare class User {
    readonly id: string;
    name: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'USER';
    isActive: boolean;
    createdAt: Date;
    constructor(id: string, name: string, email: string, password: string, role: 'ADMIN' | 'USER', isActive?: boolean, createdAt?: Date);
}
//# sourceMappingURL=User.d.ts.map