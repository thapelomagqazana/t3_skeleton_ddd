export declare class Email {
    private readonly value;
    constructor(email: string);
    getValue(): string;
    toString(): string;
    equals(other: Email): boolean;
}
