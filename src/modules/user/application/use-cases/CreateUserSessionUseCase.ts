import { UserSession } from "../../domain/entities/UserSession";
import { UserSessionRepository } from "../../domain/repositories/UserSessionRepository";
import {
  CreateUserSessionDTO,
  CreateUserSessionResultDTO,
} from "../dtos";
import { randomUUID, randomBytes } from "crypto";

export class CreateUserSessionUseCase {
  constructor(private userSessionRepository: UserSessionRepository) {}

  async execute(
    input: CreateUserSessionDTO
  ): Promise<CreateUserSessionResultDTO> {
    const sessionToken = this.generateSessionToken();
    const expiresAt = this.calculateExpirationDate();

    const session = UserSession.create(
      randomUUID(),
      input.userId,
      sessionToken,
      expiresAt
    );

    await this.userSessionRepository.create(session);

    return {
      sessionToken: session.sessionToken,
      expiresAt: session.expiresAt,
    };
  }

  private generateSessionToken(): string {
    return randomBytes(32).toString("hex");
  }

  private calculateExpirationDate(): Date {
    const expirationDays = 30;
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expirationDays);
    return expirationDate;
  }
}

