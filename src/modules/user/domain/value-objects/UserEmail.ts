export class UserEmail {
  private constructor(private readonly value: string) {
    if (!this.isValid(value)) {
      throw new Error("Invalid email address");
    }
  }

  static create(email: string): UserEmail {
    return new UserEmail(email);
  }

  getValue(): string {
    return this.value;
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length > 0 && email.length <= 255;
  }

  equals(other: UserEmail): boolean {
    return this.value === other.value;
  }
}

