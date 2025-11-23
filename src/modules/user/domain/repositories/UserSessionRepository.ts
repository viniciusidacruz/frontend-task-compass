import { UserSession } from "../entities/UserSession";

export interface UserSessionRepository {
  create(session: UserSession): Promise<UserSession>;
  findBySessionToken(sessionToken: string): Promise<UserSession | null>;
  deleteBySessionToken(sessionToken: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
}

