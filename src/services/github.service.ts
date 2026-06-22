import { AppError } from "@/lib/errors";
import { getEnv } from "@/lib/env";
import type {
  GitHubLanguages,
  GitHubProfileData,
  GitHubRepository,
  GitHubUser,
} from "@/types";

const GITHUB_API = "https://api.github.com";
const MAX_REPOSITORIES = 100;

function headers(): HeadersInit {
  const token = getEnv().GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "dev-pulse",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function githubFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${GITHUB_API}${path}`, {
    headers: headers(),
    signal: AbortSignal.timeout(15_000),
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new AppError("GitHub user was not found", 404, "GITHUB_USER_NOT_FOUND");
    }
    if (response.status === 403 || response.status === 429) {
      throw new AppError(
        "GitHub API rate limit exceeded. Configure GITHUB_TOKEN or try again later.",
        429,
        "GITHUB_RATE_LIMITED",
      );
    }
    throw new AppError("GitHub API request failed", 502, "GITHUB_API_ERROR");
  }

  return response.json() as Promise<T>;
}

export async function getGitHubProfile(username: string): Promise<GitHubProfileData> {
  const encodedUsername = encodeURIComponent(username);
  const [user, repositories] = await Promise.all([
    githubFetch<GitHubUser>(`/users/${encodedUsername}`),
    githubFetch<GitHubRepository[]>(
      `/users/${encodedUsername}/repos?per_page=${MAX_REPOSITORIES}&sort=updated&type=owner`,
    ),
  ]);

  const relevantRepositories = repositories.filter((repository) => !repository.fork && !repository.archived);
  const languageEntries = await Promise.all(
    relevantRepositories.map(async (repository) => {
      try {
        const languages = await githubFetch<GitHubLanguages>(`/repos/${repository.full_name}/languages`);
        return [repository.full_name, languages] as const;
      } catch {
        return [repository.full_name, {}] as const;
      }
    }),
  );

  return {
    user,
    repositories: relevantRepositories,
    languagesByRepo: Object.fromEntries(languageEntries),
  };
}
