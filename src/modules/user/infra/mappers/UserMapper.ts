import { User } from "../../domain/entities/User";
import { UserEmail } from "../../domain/value-objects/UserEmail";
import { UserPasswordHash } from "../../domain/value-objects/UserPasswordHash";
import { UserRoleEnum } from "../../domain/enums";
import { Prisma } from "@prisma/client";

type PrismaUser = Prisma.UserGetPayload<Record<string, never>>;

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    const role =
      prismaUser.role === "USER"
        ? UserRoleEnum.USER
        : prismaUser.role === "ADMIN"
        ? UserRoleEnum.ADMIN
        : UserRoleEnum.USER;

    return new User(
      prismaUser.id,
      UserEmail.create(prismaUser.email),
      UserPasswordHash.create(prismaUser.passwordHash),
      prismaUser.name,
      role,
      prismaUser.createdAt,
      prismaUser.updatedAt
    );
  }

  static toPersistence(user: User): {
    id: string;
    email: string;
    passwordHash: string;
    name: string | null;
    role: UserRoleEnum;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: user.id,
      email: user.email.getValue(),
      passwordHash: user.passwordHash.getValue(),
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

