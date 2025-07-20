import { Email } from '../../valueObjects/Email';

export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: Email,
    public readonly password: string,
    public readonly role: 'ADMIN' | 'USER',
    public readonly isActive: boolean = true,
    public readonly createdAt: Date = new Date()
  ) {}
}