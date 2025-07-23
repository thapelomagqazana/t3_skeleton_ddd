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
exports.UpdateUser = void 0;
/**
 * Use case to update a user's details.
 */
class UpdateUser {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    execute(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.findById(id);
            if (!user) {
                return null;
            }
            // Update using entity-level methods or direct mutation (if allowed in your model)
            if (updates.name)
                user.updateName(updates.name);
            if (updates.email)
                user.updateEmail(updates.email.getValue());
            if (updates.role)
                user.updateRole(updates.role);
            if (updates.isActive !== undefined)
                user.setActive(updates.isActive);
            return yield this.userRepo.update(user);
        });
    }
}
exports.UpdateUser = UpdateUser;
