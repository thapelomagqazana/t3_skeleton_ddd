"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
const User_1 = require("@domain/user/entities/User");
const Email_1 = require("@domain/valueObjects/Email");
class UserMapper {
    static toPersistence(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email.getValue(),
            password: user.password,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
        };
    }
    static toDomain(raw) {
        return new User_1.User(raw.id, raw.name, new Email_1.Email(raw.email), raw.password, raw.role, raw.isActive, raw.createdAt);
    }
}
exports.UserMapper = UserMapper;
