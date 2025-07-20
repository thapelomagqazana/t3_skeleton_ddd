"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
/**
 * Domain Entity representing a User in the system.
 */
class User {
    constructor(id, name, email, password, role, isActive = true, createdAt = new Date()) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }
}
exports.User = User;
