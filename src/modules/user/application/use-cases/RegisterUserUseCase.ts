import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { PasswordHasher } from "../../domain/services/PasswordHasher";
import { RegisterUserDTO, RegisterUserResultDTO } from "../dtos";
import { UserAlreadyExistsError } from "../errors";
import { UserRoleEnum } from "../../domain/enums";
import { randomUUID } from "crypto";

export class RegisterUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher
  ) {}

  async execute(input: RegisterUserDTO): Promise<RegisterUserResultDTO> {
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new UserAlreadyExistsError(input.email);
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const user = User.create(
      randomUUID(),
      input.email,
      passwordHash,
      input.name,
      UserRoleEnum.USER
    );

    const createdUser = await this.userRepository.create(user);

    return {
      id: createdUser.id,
      email: createdUser.email.getValue(),
      name: createdUser.name,
    };
  }
}

