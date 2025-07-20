export class Email {
  private readonly value: string;

  constructor(email: string) {
    const normalized = email.trim().toLowerCase();
    const emailRegex = /^[\w.-]+@[\w.-]+\.\w{2,}$/;

    if (!emailRegex.test(normalized)) {
      throw new Error('Invalid email format');
    }

    this.value = normalized;
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.getValue();
  }
}