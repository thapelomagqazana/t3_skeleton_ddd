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
exports.AuthUser = void 0;
const HashService_1 = require("@services/auth/HashService");
/**
 * Use case to authenticate a user by email and password.
 */
class AuthUser {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    execute(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.findByEmail(email);
            if (!user)
                throw new Error('Invalid credentials');
            const isMatch = yield (0, HashService_1.comparePasswords)(password, user.password);
            if (!isMatch)
                throw new Error('Invalid credentials');
            return user;
        });
    }
}
exports.AuthUser = AuthUser;
