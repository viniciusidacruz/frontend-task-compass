import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string().nullable(),
  email: z.string().email(),
  password: z.string().min(8),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

