import { Email } from '../../valueObjects/Email';

export class User {
  constructor(
    private readonly _id: string,
    private _name: string,
    private _email: Email,
    private _password: string,
    private _role: 'ADMIN' | 'USER',
    private _isActive: boolean = true,
    private readonly _createdAt: Date = new Date()
  ) {}

  // Getters
  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get email() {
    return this._email;
  }

  get role() {
    return this._role;
  }

  get isActive() {
    return this._isActive;
  }

  get createdAt() {
    return this._createdAt;
  }

  get password() {
    return this._password;
  }

  // Domain-safe setters
  updateName(name: string) {
    this._name = name.trim();
  }

  updateEmail(email: string) {
    try {
      this._email = new Email(email);
    } catch {
      throw new Error('Invalid email format');
    }
  }

  updateRole(role: 'ADMIN' | 'USER') {
    this._role = role;
  }

  setActive(status: boolean) {
    this._isActive = status;
  }

  updatePassword(newPassword: string) {
    this._password = newPassword;
  }
}
