import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { UserMapper } from "../mappers/UserMapper";
import { prisma } from "../../../../lib/prisma/client";

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!prismaUser) {
      return null;
    }

    return UserMapper.toDomain(prismaUser);
  }

  async findById(id: string): Promise<User | null> {
    const prismaUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!prismaUser) {
      return null;
    }

    return UserMapper.toDomain(prismaUser);
  }

  async create(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user);

    const prismaUser = await prisma.user.create({
      data,
    });

    return UserMapper.toDomain(prismaUser);
  }

  async update(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user);

    const prismaUser = await prisma.user.update({
      where: { id: user.id },
      data,
    });

    return UserMapper.toDomain(prismaUser);
  }
}

