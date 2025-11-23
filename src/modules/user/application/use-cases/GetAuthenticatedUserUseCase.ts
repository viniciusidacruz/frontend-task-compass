import { UserRepository } from "../../domain/repositories/UserRepository";
import { UserSessionRepository } from "../../domain/repositories/UserSessionRepository";
import {
  GetAuthenticatedUserDTO,
  GetAuthenticatedUserResultDTO,
} from "../dtos";
import { SessionNotFoundError } from "../errors";

export class GetAuthenticatedUserUseCase {
  constructor(
    private userSessionRepository: UserSessionRepository,
    private userRepository: UserRepository
  ) {}

  async execute(
    input: GetAuthenticatedUserDTO
  ): Promise<GetAuthenticatedUserResultDTO | null> {
    const session = await this.userSessionRepository.findBySessionToken(
      input.sessionToken
    );

    if (!session || session.isExpired()) {
      return null;
    }

    const user = await this.userRepository.findById(session.userId);

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email.getValue(),
      name: user.name,
    };
  }
}

