export class Email {
  private readonly value: string;

  constructor(email: string) {
    // console.log(`[Email VO] 🔍 Normalizing email → "${email}"`);
    const normalized = email.trim().toLowerCase();
    const emailRegex = /^[\w.-]+@[\w.-]+\.\w{2,}$/;

    if (!emailRegex.test(normalized)) {
      // console.error(`[Email VO] ❌ Invalid email input → "${email}"`);
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
