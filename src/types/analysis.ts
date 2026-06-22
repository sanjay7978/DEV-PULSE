export interface Technology {
  name: string;
  category: "language" | "framework" | "library" | "tool" | "platform" | "other";
  evidence: string[];
}

export interface TechnologyProfile {
  technologies: Technology[];
  languages: Record<string, number>;
  topics: string[];
}

export interface GeminiAnalysis {
  summary: string;
  experienceLevel: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  strengths: string[];
  notableProjects: Array<{ name: string; reason: string }>;
  suggestedFocus: string[];
}

export interface ProfileDto {
  name: string | null;
  username: string;
  avatarUrl: string;
  bio: string | null;
  followers: number;
  following: number;
  publicRepos: number;
}

export interface RepositoryDto {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  url: string;
}

export interface AnalysisResult {
  profile: ProfileDto;
  repositories: RepositoryDto[];
  technologies: string[];
  summary: string;
  experienceLevel: GeminiAnalysis["experienceLevel"];
}

export interface ApiErrorResponse {
  error: { code: string; message: string; details?: unknown };
}
