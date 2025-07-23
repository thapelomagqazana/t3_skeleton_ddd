import { Email } from '../../valueObjects/Email';
export declare class User {
    private readonly _id;
    private _name;
    private _email;
    private _password;
    private _role;
    private _isActive;
    private readonly _createdAt;
    constructor(_id: string, _name: string, _email: Email, _password: string, _role: 'ADMIN' | 'USER', _isActive?: boolean, _createdAt?: Date);
    get id(): string;
    get name(): string;
    get email(): Email;
    get role(): "ADMIN" | "USER";
    get isActive(): boolean;
    get createdAt(): Date;
    get password(): string;
    updateName(name: string): void;
    updateEmail(email: string): void;
    updateRole(role: 'ADMIN' | 'USER'): void;
    setActive(status: boolean): void;
    updatePassword(newPassword: string): void;
}
