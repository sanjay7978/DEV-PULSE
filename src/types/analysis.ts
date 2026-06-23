export interface Technology {
  name: string;
  category: "language" | "framework" | "library" | "tool" | "platform" | "other";
  evidence: string[];
}

export interface TechnologyProfile {
  technologies: Technology[];
  languages: Record<string, number>;
  topics: string[];
  categories: TechnologyCategories;
}

export interface TechnologyCategories {
  frontend: string[];
  backend: string[];
  database: string[];
  devops: string[];
  ai: string[];
  testing: string[];
}

export interface GeminiAnalysis {
  summary: string;
  experienceLevel: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  strengths: string[];
  notableProjects: Array<{ name: string; reason: string }>;
  suggestedFocus: string[];
  limitedEvidence: string[];
  projectInsights: string;
  recommendedRoles: string[];
  profileAssessment: string;
}

export interface RecruiterInsights {
  strengths: string[];
  limitedEvidence: string[];
  projectInsights: string;
  recommendedRoles: string[];
  profileAssessment: string;
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

export interface ScoreBreakdown {
  repositoryQuality: number;
  projectComplexity: number;
  skillDiversity: number;
  activity: number;
  engineeringPractices: number;
}

export interface DeveloperScore {
  score: number;
  breakdown: ScoreBreakdown;
}

export interface AnalysisResult {
  profile: ProfileDto;
  repositories: RepositoryDto[];
  technologies: string[];
  categories: TechnologyCategories;
  summary: string;
  experienceLevel: GeminiAnalysis["experienceLevel"] | "Unavailable";
  aiInsightsAvailable: boolean;
  score: number;
  breakdown: ScoreBreakdown;
  insights: RecruiterInsights;
}

export interface ApiErrorResponse {
  error: { code: string; message: string; details?: unknown };
}
