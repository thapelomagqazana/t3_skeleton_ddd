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
const prisma = new client_1.PrismaClient();
/**
 * Implements IUserRepository using Prisma ORM.
 */
class UserRepository {
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield prisma.user.findMany();
            return users.map(u => new User_1.User(u.id, u.name, u.email, u.password, u.role, u.isActive, u.createdAt));
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const u = yield prisma.user.findUnique({ where: { id } });
            return u ? new User_1.User(u.id, u.name, u.email, u.password, u.role, u.isActive, u.createdAt) : null;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const u = yield prisma.user.findUnique({ where: { email } });
            return u ? new User_1.User(u.id, u.name, u.email, u.password, u.role, u.isActive, u.createdAt) : null;
        });
    }
    save(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const saved = yield prisma.user.create({ data: Object.assign({}, user) });
            return new User_1.User(saved.id, saved.name, saved.email, saved.password, saved.role, saved.isActive, saved.createdAt);
        });
    }
    update(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield prisma.user.update({ where: { id: user.id }, data: Object.assign({}, user) });
            return new User_1.User(updated.id, updated.name, updated.email, updated.password, updated.role, updated.isActive, updated.createdAt);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.user.update({
                where: { id },
                data: { isActive: false }
            });
        });
    }
}
exports.UserRepository = UserRepository;
