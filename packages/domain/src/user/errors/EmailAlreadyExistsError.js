"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailAlreadyExistsError = void 0;
class EmailAlreadyExistsError extends Error {
    constructor(email) {
        super(`Email "${email}" is already in use.`);
        this.name = 'EmailAlreadyExistsError';
        // Fix for subclassing Error in TypeScript
        Object.setPrototypeOf(this, EmailAlreadyExistsError.prototype);
    }
}
exports.EmailAlreadyExistsError = EmailAlreadyExistsError;
