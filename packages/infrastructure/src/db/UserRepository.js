"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const client_1 = require("@prisma/client");
const User_1 = require("@domain/user/entities/User");
const Email_1 = require("@domain/valueObjects/Email");
const UserMapper_1 = require("./UserMapper");
const prisma = new client_1.PrismaClient();
/**
 * Implements IUserRepository using Prisma ORM.
 */
class UserRepository {
    findAll() {
        return __awaiter(this, arguments, void 0, function* ({ role, active, search, page = 1, limit = 10, } = {}) {
            const where = {};
            if (role) {
                const upperRole = role.toUpperCase();
                if (Object.values(client_1.Role).includes(upperRole)) {
                    where.role = upperRole;
                }
                else {
                    throw new Error(`Invalid role filter: ${role}`);
                }
            }
            if (typeof active === 'string') {
                const normalized = active.toLowerCase().trim();
                if (normalized === 'true') {
                    where.isActive = true;
                }
                else if (normalized === 'false') {
                    where.isActive = false;
                }
                else {
                    throw new Error(`Invalid value for 'active': ${active}`);
                }
            }
            else if (typeof active === 'boolean') {
                where.isActive = active;
            }
            if (search) {
                where.name = { contains: search, mode: 'insensitive' };
            }
            const users = yield prisma.user.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
            });
            return users.map(u => new User_1.User(u.id, u.name, new Email_1.Email(u.email), u.password, u.role, u.isActive, u.createdAt));
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const u = yield prisma.user.findUnique({ where: { id } });
            return u ? new User_1.User(u.id, u.name, new Email_1.Email(u.email), u.password, u.role, u.isActive, u.createdAt) : null;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const u = yield prisma.user.findUnique({ where: { email } });
            return u ? new User_1.User(u.id, u.name, new Email_1.Email(u.email), u.password, u.role, u.isActive, u.createdAt) : null;
        });
    }
    save(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const saved = yield prisma.user.create({
                data: UserMapper_1.UserMapper.toPersistence(user),
            });
            return UserMapper_1.UserMapper.toDomain(saved);
        });
    }
    update(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield prisma.user.update({
                where: { id: user.id },
                data: UserMapper_1.UserMapper.toPersistence(user),
            });
            return UserMapper_1.UserMapper.toDomain(updated);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({ where: { id } });
            if (!user)
                return false;
            if (!user.isActive)
                return 'alreadyDeleted';
            yield prisma.user.update({
                where: { id },
                data: { isActive: false },
            });
            return 'deleted';
        });
    }
}
exports.UserRepository = UserRepository;
