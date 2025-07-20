/**
 * Hashes a plain text password
 */
export declare const hashPassword: (plain: string) => Promise<string>;
/**
 * Compares plain password with hashed password
 */
export declare const comparePasswords: (plain: string, hash: string) => Promise<boolean>;
//# sourceMappingURL=HashService.d.ts.map