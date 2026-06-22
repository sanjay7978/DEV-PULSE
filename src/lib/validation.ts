import { z } from "zod";

export const githubUsernameSchema = z
  .string()
  .trim()
  .min(1, "GitHub username is required")
  .max(39, "GitHub usernames cannot exceed 39 characters")
  .regex(/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i, "Invalid GitHub username")
  .refine((value) => !value.includes("--"), "Invalid GitHub username");

export const analyzeRequestSchema = z.object({
  username: githubUsernameSchema,
});
