export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid credentials. Please check your email and password.');
    this.name = 'InvalidCredentialsError';
  }
}
