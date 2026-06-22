import { ZodError } from "zod";
import { AppError } from "@/lib/errors";
import { analyzeRequestSchema } from "@/lib/validation";
import { analyzeWithGemini } from "@/services/gemini.service";
import { getGitHubProfile } from "@/services/github.service";
import { extractTechnologies } from "@/services/technology.service";
import type { AnalysisResult, ApiErrorResponse } from "@/types";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new AppError("Request body must be valid JSON", 400, "INVALID_JSON");
    }

    const { username } = analyzeRequestSchema.parse(body);
    const github = await getGitHubProfile(username);
    const technologyProfile = extractTechnologies(github);
    const aiAnalysis = await analyzeWithGemini(github, technologyProfile);
    const result: AnalysisResult = {
      profile: {
        name: github.user.name,
        username: github.user.login,
        avatarUrl: github.user.avatar_url,
        bio: github.user.bio,
        followers: github.user.followers,
        following: github.user.following,
        publicRepos: github.user.public_repos,
      },
      repositories: github.repositories.slice(0, 5).map((repository) => ({
        name: repository.name,
        description: repository.description,
        language: repository.language,
        stars: repository.stargazers_count,
        forks: repository.forks_count,
        url: repository.html_url,
      })),
      technologies: technologyProfile.technologies.map((technology) => technology.name),
      summary: aiAnalysis.summary,
      experienceLevel: aiAnalysis.experienceLevel,
    };
    return Response.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json(
        { error: { code: "VALIDATION_ERROR", message: error.issues[0]?.message ?? "Invalid request", details: error.flatten() } } satisfies ApiErrorResponse,
        { status: 400 },
      );
    }
    if (error instanceof AppError) {
      return Response.json(
        { error: { code: error.code, message: error.message } } satisfies ApiErrorResponse,
        { status: error.statusCode },
      );
    }
    console.error("Unhandled analysis error", error);
    return Response.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } } satisfies ApiErrorResponse,
      { status: 500 },
    );
  }
}
