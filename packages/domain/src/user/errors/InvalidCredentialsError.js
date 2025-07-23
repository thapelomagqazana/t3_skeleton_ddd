"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidCredentialsError = void 0;
class InvalidCredentialsError extends Error {
    constructor() {
        super('Invalid credentials. Please check your email and password.');
        this.name = 'InvalidCredentialsError';
    }
}
exports.InvalidCredentialsError = InvalidCredentialsError;
