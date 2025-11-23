"use server";

import { cookies } from "next/headers";
import { GetAuthenticatedUserUseCase } from "../../application/use-cases/GetAuthenticatedUserUseCase";
import { PrismaUserRepository } from "../../infra/prisma/PrismaUserRepository";
import { PrismaUserSessionRepository } from "../../infra/prisma/PrismaUserSessionRepository";
import { GetAuthenticatedUserResultDTO } from "../../application/dtos";

export async function getCurrentUserAction(): Promise<GetAuthenticatedUserResultDTO | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    return null;
  }

  const userSessionRepository = new PrismaUserSessionRepository();
  const userRepository = new PrismaUserRepository();
  const getAuthenticatedUserUseCase = new GetAuthenticatedUserUseCase(
    userSessionRepository,
    userRepository
  );

  return await getAuthenticatedUserUseCase.execute({ sessionToken });
}

