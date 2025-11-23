import { UserEmail } from "../value-objects/UserEmail";
import { UserPasswordHash } from "../value-objects/UserPasswordHash";
import { UserRoleEnum } from "../enums/UserRoleEnum";

export class User {
  constructor(
    public readonly id: string,
    public readonly email: UserEmail,
    public readonly passwordHash: UserPasswordHash,
    public readonly name: string | null,
    public readonly role: UserRoleEnum,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    if (!id || id.length === 0) {
      throw new Error("User id cannot be empty");
    }
  }

  static create(
    id: string,
    email: string,
    passwordHash: string,
    name: string | null,
    role: UserRoleEnum = UserRoleEnum.USER
  ): User {
    return new User(
      id,
      UserEmail.create(email),
      UserPasswordHash.create(passwordHash),
      name,
      role,
      new Date(),
      new Date()
    );
  }

  updateName(name: string | null): User {
    return new User(
      this.id,
      this.email,
      this.passwordHash,
      name,
      this.role,
      this.createdAt,
      new Date()
    );
  }

  updatePasswordHash(passwordHash: string): User {
    return new User(
      this.id,
      this.email,
      UserPasswordHash.create(passwordHash),
      this.name,
      this.role,
      this.createdAt,
      new Date()
    );
  }
}
