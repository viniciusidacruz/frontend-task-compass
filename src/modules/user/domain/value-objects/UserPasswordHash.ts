export class UserPasswordHash {
  private constructor(private readonly value: string) {
    if (!value || value.length === 0) {
      throw new Error("Password hash cannot be empty");
    }
  }

  static create(hash: string): UserPasswordHash {
    return new UserPasswordHash(hash);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: UserPasswordHash): boolean {
    return this.value === other.value;
  }
}

