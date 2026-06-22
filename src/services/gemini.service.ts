import { AppError } from "@/lib/errors";
import { getEnv } from "@/lib/env";
import type { DeveloperScore, GeminiAnalysis, GitHubProfileData, TechnologyProfile } from "@/types";
import type { SkillCoverageDatum } from "@/lib/skill-coverage";

interface GeminiResponse {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  error?: { message?: string };
}

const responseSchema = {
  type: "OBJECT",
  properties: {
    summary: { type: "STRING" },
    experienceLevel: {
      type: "STRING",
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
    },
    strengths: { type: "ARRAY", minItems: 3, maxItems: 5, items: { type: "STRING" } },
    notableProjects: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: { name: { type: "STRING" }, reason: { type: "STRING" } },
        required: ["name", "reason"],
      },
    },
    suggestedFocus: { type: "ARRAY", items: { type: "STRING" } },
    limitedEvidence: { type: "ARRAY", maxItems: 4, items: { type: "STRING" } },
    projectInsights: { type: "STRING" },
    recommendedRoles: { type: "ARRAY", maxItems: 4, items: { type: "STRING" } },
    profileAssessment: { type: "STRING" },
  },
  required: ["summary", "experienceLevel", "strengths", "notableProjects", "suggestedFocus", "limitedEvidence", "projectInsights", "recommendedRoles", "profileAssessment"],
};

export async function analyzeWithGemini(
  github: GitHubProfileData,
  technologyProfile: TechnologyProfile,
  developerScore: DeveloperScore,
  skillCoverage: SkillCoverageDatum[],
): Promise<GeminiAnalysis> {
  const env = getEnv();
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(env.GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY)}`;
  const repositories = github.repositories.slice(0, 30).map((repository) => ({
    name: repository.name,
    description: repository.description,
    stars: repository.stargazers_count,
    forks: repository.forks_count,
    language: repository.language,
    topics: repository.topics,
  }));
  const prompt = [
    "Analyze this public GitHub developer profile for a recruiter. Be factual and base every claim only on supplied public evidence. Classify experienceLevel as Beginner, Intermediate, Advanced, or Expert. Return 3-5 strengths as concise capability phrases. Return up to 4 limitedEvidence phrases for areas with missing or low public evidence; never call them weaknesses or claim the developer lacks a skill. Write projectInsights as a professional, easy-to-scan recruiter briefing of 100-150 words without generic AI language. Recommend at most 4 roles, and only roles directly supported by the evidence. profileAssessment must be one concise, neutral portfolio description and must never make a hiring recommendation or use Recommended, Not Recommended, or Recommended with Reservations.",
    JSON.stringify({
      user: { login: github.user.login, name: github.user.name, bio: github.user.bio },
      repositories,
      technologyProfile,
      developerScore,
      skillCoverage,
    }),
  ].join("\n\n");

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.25,
          responseMimeType: "application/json",
          responseSchema,
        },
      }),
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    throw new AppError("Gemini request timed out or could not be reached", 502, "GEMINI_UNAVAILABLE");
  }

  const payload = (await response.json()) as GeminiResponse;
  if (!response.ok) {
    throw new AppError(payload.error?.message ?? "Gemini analysis failed", 502, "GEMINI_API_ERROR");
  }

  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new AppError("Gemini returned an empty response", 502, "GEMINI_EMPTY_RESPONSE");

  try {
    return JSON.parse(text) as GeminiAnalysis;
  } catch {
    throw new AppError("Gemini returned malformed analysis", 502, "GEMINI_INVALID_RESPONSE");
  }
}
