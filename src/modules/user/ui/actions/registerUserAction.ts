"use server";

import { RegisterUserUseCase } from "../../application/use-cases/RegisterUserUseCase";
import { PrismaUserRepository } from "../../infra/prisma/PrismaUserRepository";
import { BcryptPasswordHasher } from "../../infra/external/BcryptPasswordHasher";
import { RegisterUserDTO, RegisterUserResultDTO } from "../../application/dtos";

export async function registerUserAction(
  input: RegisterUserDTO
): Promise<RegisterUserResultDTO> {
  const userRepository = new PrismaUserRepository();
  const passwordHasher = new BcryptPasswordHasher();
  const registerUserUseCase = new RegisterUserUseCase(
    userRepository,
    passwordHasher
  );

  return await registerUserUseCase.execute(input);
}

