import { UserSession } from "../../domain/entities/UserSession";
import { Prisma } from "@prisma/client";

type PrismaUserSession = Prisma.UserSessionGetPayload<Record<string, never>>;

export class UserSessionMapper {
  static toDomain(prismaSession: PrismaUserSession): UserSession {
    return new UserSession(
      prismaSession.id,
      prismaSession.userId,
      prismaSession.sessionToken,
      prismaSession.expiresAt,
      prismaSession.createdAt,
      prismaSession.updatedAt
    );
  }

  static toPersistence(session: UserSession): {
    id: string;
    userId: string;
    sessionToken: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: session.id,
      userId: session.userId,
      sessionToken: session.sessionToken,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }
}

