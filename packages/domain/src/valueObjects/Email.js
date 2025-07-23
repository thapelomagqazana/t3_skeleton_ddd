"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
class Email {
    constructor(email) {
        console.log(`[Email VO] 🔍 Normalizing email → "${email}"`);
        const normalized = email.trim().toLowerCase();
        const emailRegex = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
        if (!emailRegex.test(normalized)) {
            console.error(`[Email VO] ❌ Invalid email input → "${email}"`);
            throw new Error('Invalid email format');
        }
        this.value = normalized;
    }
    getValue() {
        return this.value;
    }
    toString() {
        return this.value;
    }
    equals(other) {
        return this.value === other.getValue();
    }
}
exports.Email = Email;
