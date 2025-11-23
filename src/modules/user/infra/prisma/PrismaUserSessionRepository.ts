import { UserSession } from "../../domain/entities/UserSession";
import { UserSessionRepository } from "../../domain/repositories/UserSessionRepository";
import { UserSessionMapper } from "../mappers/UserSessionMapper";
import { prisma } from "../../../../lib/prisma/client";

export class PrismaUserSessionRepository implements UserSessionRepository {
  async create(session: UserSession): Promise<UserSession> {
    const data = UserSessionMapper.toPersistence(session);

    const prismaSession = await prisma.userSession.create({
      data,
    });

    return UserSessionMapper.toDomain(prismaSession);
  }

  async findBySessionToken(sessionToken: string): Promise<UserSession | null> {
    const prismaSession = await prisma.userSession.findUnique({
      where: { sessionToken },
    });

    if (!prismaSession) {
      return null;
    }

    return UserSessionMapper.toDomain(prismaSession);
  }

  async deleteBySessionToken(sessionToken: string): Promise<void> {
    await prisma.userSession.deleteMany({
      where: { sessionToken },
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await prisma.userSession.deleteMany({
      where: { userId },
    });
  }
}

