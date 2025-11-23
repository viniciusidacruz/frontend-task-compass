"use server";

import { cookies } from "next/headers";
import { LogoutUserUseCase } from "../../application/use-cases/LogoutUserUseCase";
import { PrismaUserSessionRepository } from "../../infra/prisma/PrismaUserSessionRepository";

export async function signOutAction(): Promise<void> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    return;
  }

  const userSessionRepository = new PrismaUserSessionRepository();
  const logoutUserUseCase = new LogoutUserUseCase(userSessionRepository);

  await logoutUserUseCase.execute({ sessionToken });

  cookieStore.delete("session_token");
}

