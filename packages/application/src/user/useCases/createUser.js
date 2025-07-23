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
exports.CreateUser = void 0;
const User_1 = require("@domain/user/entities/User");
const EmailAlreadyExistsError_1 = require("@domain/user/errors/EmailAlreadyExistsError");
const HashService_1 = require("@services/auth/HashService");
const Email_1 = require("@domain/valueObjects/Email");
/**
 * Use case to create a new user account.
 */
class CreateUser {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    execute(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = new Email_1.Email(input.email);
            const existingUser = yield this.userRepo.findByEmail(email.getValue());
            if (existingUser) {
                throw new EmailAlreadyExistsError_1.EmailAlreadyExistsError(input.email);
            }
            const hashedPassword = yield (0, HashService_1.hashPassword)(input.password);
            const user = new User_1.User(crypto.randomUUID(), input.name.trim(), email, hashedPassword, input.role === 'ADMIN' ? 'ADMIN' : 'USER');
            return yield this.userRepo.save(user);
        });
    }
}
exports.CreateUser = CreateUser;
