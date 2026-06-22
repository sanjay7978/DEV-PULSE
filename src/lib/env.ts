import { z } from "zod";

const envSchema = z.object({
  GITHUB_TOKEN: z.string().min(1).optional(),
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),
  GEMINI_MODEL: z.string().min(1).default("gemini-2.5-flash"),
});

export type ServerEnv = z.infer<typeof envSchema>;

let cachedEnv: ServerEnv | undefined;

export function getEnv(): ServerEnv {
  cachedEnv ??= envSchema.parse({
    GITHUB_TOKEN: process.env.GITHUB_TOKEN || undefined,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_MODEL: process.env.GEMINI_MODEL,
  });
  return cachedEnv;
}
