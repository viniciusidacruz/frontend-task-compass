export class UserSession {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly sessionToken: string,
    public readonly expiresAt: Date,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    if (!id || id.length === 0) {
      throw new Error("Session id cannot be empty");
    }
    if (!userId || userId.length === 0) {
      throw new Error("User id cannot be empty");
    }
    if (!sessionToken || sessionToken.length === 0) {
      throw new Error("Session token cannot be empty");
    }
    if (expiresAt <= new Date()) {
      throw new Error("Session expiration date must be in the future");
    }
  }

  static create(
    id: string,
    userId: string,
    sessionToken: string,
    expiresAt: Date
  ): UserSession {
    return new UserSession(
      id,
      userId,
      sessionToken,
      expiresAt,
      new Date(),
      new Date()
    );
  }

  isExpired(): boolean {
    return this.expiresAt <= new Date();
  }
}

