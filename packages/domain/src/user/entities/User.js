"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const Email_1 = require("../../valueObjects/Email");
class User {
    constructor(_id, _name, _email, _password, _role, _isActive = true, _createdAt = new Date()) {
        this._id = _id;
        this._name = _name;
        this._email = _email;
        this._password = _password;
        this._role = _role;
        this._isActive = _isActive;
        this._createdAt = _createdAt;
    }
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
    updateName(name) {
        this._name = name.trim();
    }
    updateEmail(email) {
        try {
            this._email = new Email_1.Email(email);
        }
        catch (_a) {
            throw new Error('Invalid email format');
        }
    }
    updateRole(role) {
        this._role = role;
    }
    setActive(status) {
        this._isActive = status;
    }
    updatePassword(newPassword) {
        this._password = newPassword;
    }
}
exports.User = User;
