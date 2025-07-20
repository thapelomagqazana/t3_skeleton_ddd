"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePasswords = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * Hashes a plain text password
 */
const hashPassword = (plain) => bcrypt_1.default.hash(plain, 10);
exports.hashPassword = hashPassword;
/**
 * Compares plain password with hashed password
 */
const comparePasswords = (plain, hash) => bcrypt_1.default.compare(plain, hash);
exports.comparePasswords = comparePasswords;
