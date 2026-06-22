import { AppError } from "@/lib/errors";
import { getEnv } from "@/lib/env";
import type {
  GitHubLanguages,
  GitHubProfileData,
  GitHubRepository,
  GitHubUser,
  RepositorySourceFile,
} from "@/types";

const GITHUB_API = "https://api.github.com";
const MAX_REPOSITORIES = 100;
const MAX_SOURCE_SCAN_REPOSITORIES = 20;
const SOURCE_PATHS = ["package.json", "requirements.txt", "Dockerfile", "README.md"] as const;

interface GitHubContentEntry {
  type: "file" | "dir" | "symlink" | "submodule";
  path: string;
  download_url: string | null;
}

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

async function githubOptionalFetch<T>(path: string): Promise<T | undefined> {
  const response = await fetch(`${GITHUB_API}${path}`, {
    headers: headers(),
    signal: AbortSignal.timeout(10_000),
    next: { revalidate: 300 },
  });
  if (response.status === 404) return undefined;
  if (!response.ok) return undefined;
  return response.json() as Promise<T>;
}

async function fetchText(url: string): Promise<string | undefined> {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "dev-pulse" },
      signal: AbortSignal.timeout(8_000),
      next: { revalidate: 300 },
    });
    if (!response.ok) return undefined;
    return (await response.text()).slice(0, 200_000);
  } catch {
    return undefined;
  }
}

async function getRepositorySourceFiles(repository: GitHubRepository): Promise<RepositorySourceFile[]> {
  const rawBase = `https://raw.githubusercontent.com/${repository.full_name}/${encodeURIComponent(repository.default_branch)}`;
  const rootFiles = await Promise.all(
    SOURCE_PATHS.map(async (path) => {
      const content = await fetchText(`${rawBase}/${path}`);
      return content === undefined ? undefined : { path, content };
    }),
  );
  const workflowEntries = await githubOptionalFetch<GitHubContentEntry[]>(
    `/repos/${repository.full_name}/contents/.github/workflows?ref=${encodeURIComponent(repository.default_branch)}`,
  );
  const workflowFiles = await Promise.all(
    (workflowEntries ?? [])
      .filter((entry) => entry.type === "file" && entry.download_url && /\.ya?ml$/i.test(entry.path))
      .slice(0, 10)
      .map(async (entry) => {
        const content = await fetchText(entry.download_url as string);
        return content === undefined ? undefined : { path: entry.path, content };
      }),
  );
  return [...rootFiles, ...workflowFiles].filter((file): file is RepositorySourceFile => file !== undefined);
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
  const sourceEntries = await Promise.all(
    relevantRepositories.slice(0, MAX_SOURCE_SCAN_REPOSITORIES).map(async (repository) => [
      repository.full_name,
      await getRepositorySourceFiles(repository),
    ] as const),
  );

  return {
    user,
    repositories: relevantRepositories,
    languagesByRepo: Object.fromEntries(languageEntries),
    sourceFilesByRepo: Object.fromEntries(sourceEntries),
  };
}
