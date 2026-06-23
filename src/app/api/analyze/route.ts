import { AppError } from "@/lib/errors";
import { analyzeRequestSchema } from "@/lib/validation";
import { analyzeWithGemini } from "@/services/gemini.service";
import { getGitHubProfile } from "@/services/github.service";
import { calculateDeveloperScore } from "@/services/scoring.service";
import { getSkillCoverageData } from "@/lib/skill-coverage";
import { extractTechnologies } from "@/services/technology.service";
import type { AnalysisResult, ApiErrorResponse, GeminiAnalysis } from "@/types";

export const runtime = "nodejs";

const GEMINI_RETRY_DELAY_MS = 3_000;

type AiAnalysisResult = Omit<GeminiAnalysis, "experienceLevel"> & {
  experienceLevel: GeminiAnalysis["experienceLevel"] | "Unavailable";
};

const fallbackAiAnalysis: AiAnalysisResult = {
  summary: "AI summary is temporarily unavailable due to high demand.",
  experienceLevel: "Unavailable",
  strengths: [],
  notableProjects: [],
  suggestedFocus: [],
  limitedEvidence: [],
  projectInsights: "AI-generated project insights are temporarily unavailable.",
  recommendedRoles: [],
  profileAssessment: "Profile assessment is temporarily unavailable.",
};

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

export async function POST(request: Request): Promise<Response> {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new AppError("Request body must be valid JSON", 400, "INVALID_JSON");
    }

    const requestData = analyzeRequestSchema.safeParse(body);
    if (!requestData.success) {
      return Response.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: requestData.error.issues[0]?.message ?? "Invalid request",
            details: requestData.error.flatten(),
          },
        } satisfies ApiErrorResponse,
        { status: 400 },
      );
    }

    const { username } = requestData.data;
    const github = await getGitHubProfile(username);
    const technologyProfile = extractTechnologies(github);
    const developerScore = calculateDeveloperScore(github, technologyProfile);
    const skillCoverage = getSkillCoverageData(technologyProfile.categories);
    let aiAnalysis: AiAnalysisResult;
    let aiInsightsAvailable = true;

    try {
      aiAnalysis = await analyzeWithGemini(github, technologyProfile, developerScore, skillCoverage);
    } catch (firstError) {
      console.error("Gemini analysis failed; retrying once:", firstError);
      await wait(GEMINI_RETRY_DELAY_MS);

      try {
        aiAnalysis = await analyzeWithGemini(github, technologyProfile, developerScore, skillCoverage);
      } catch (retryError) {
        console.error("Gemini analysis retry failed; using fallback AI data:", retryError);
        aiAnalysis = fallbackAiAnalysis;
        aiInsightsAvailable = false;
      }
    }
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
      categories: technologyProfile.categories,
      summary: aiAnalysis.summary,
      experienceLevel: aiAnalysis.experienceLevel,
      aiInsightsAvailable,
      score: developerScore.score,
      breakdown: developerScore.breakdown,
      insights: {
        strengths: aiAnalysis.strengths.slice(0, 5),
        limitedEvidence: aiAnalysis.limitedEvidence.slice(0, 4),
        projectInsights: aiAnalysis.projectInsights,
        recommendedRoles: aiAnalysis.recommendedRoles.slice(0, 4),
        profileAssessment: aiAnalysis.profileAssessment,
      },
    };
    return Response.json(result);
  } catch (error) {
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
