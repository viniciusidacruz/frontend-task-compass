"use server";

import { cookies } from "next/headers";
import { AuthenticateUserUseCase } from "../../application/use-cases/AuthenticateUserUseCase";
import { CreateUserSessionUseCase } from "../../application/use-cases/CreateUserSessionUseCase";
import { PrismaUserRepository } from "../../infra/prisma/PrismaUserRepository";
import { PrismaUserSessionRepository } from "../../infra/prisma/PrismaUserSessionRepository";
import { BcryptPasswordHasher } from "../../infra/external/BcryptPasswordHasher";
import { AuthenticateUserDTO, AuthenticateUserResultDTO } from "../../application/dtos";

export async function signInAction(
  input: AuthenticateUserDTO
): Promise<AuthenticateUserResultDTO> {
  const userRepository = new PrismaUserRepository();
  const passwordHasher = new BcryptPasswordHasher();
  const authenticateUserUseCase = new AuthenticateUserUseCase(
    userRepository,
    passwordHasher
  );

  const authenticatedUser = await authenticateUserUseCase.execute(input);

  const userSessionRepository = new PrismaUserSessionRepository();
  const createUserSessionUseCase = new CreateUserSessionUseCase(
    userSessionRepository
  );

  const session = await createUserSessionUseCase.execute({
    userId: authenticatedUser.userId,
  });

  const cookieStore = await cookies();
  cookieStore.set("session_token", session.sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: session.expiresAt,
    path: "/",
  });

  return authenticatedUser;
}

