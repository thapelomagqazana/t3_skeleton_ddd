export class EmailAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`Email "${email}" is already in use.`);
    this.name = 'EmailAlreadyExistsError';

    // Fix for subclassing Error in TypeScript
    Object.setPrototypeOf(this, EmailAlreadyExistsError.prototype);
  }
}
