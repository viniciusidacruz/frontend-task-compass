import { UserRepository } from "../../domain/repositories/UserRepository";
import { PasswordHasher } from "../../domain/services/PasswordHasher";
import {
  AuthenticateUserDTO,
  AuthenticateUserResultDTO,
} from "../dtos";
import { InvalidCredentialsError } from "../errors";

export class AuthenticateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher
  ) {}

  async execute(
    input: AuthenticateUserDTO
  ): Promise<AuthenticateUserResultDTO> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await this.passwordHasher.compare(
      input.password,
      user.passwordHash.getValue()
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    return {
      userId: user.id,
      email: user.email.getValue(),
      name: user.name,
    };
  }
}

