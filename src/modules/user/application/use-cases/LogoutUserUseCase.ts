import { UserSessionRepository } from "../../domain/repositories/UserSessionRepository";
import { LogoutUserDTO } from "../dtos";

export class LogoutUserUseCase {
  constructor(private userSessionRepository: UserSessionRepository) {}

  async execute(input: LogoutUserDTO): Promise<void> {
    await this.userSessionRepository.deleteBySessionToken(input.sessionToken);
  }
}

