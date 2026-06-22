export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  fork: boolean;
  archived: boolean;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  pushed_at: string | null;
  size: number;
  default_branch: string;
}

export type GitHubLanguages = Record<string, number>;

export interface RepositorySourceFile {
  path: string;
  content: string;
}

export interface GitHubProfileData {
  user: GitHubUser;
  repositories: GitHubRepository[];
  languagesByRepo: Record<string, GitHubLanguages>;
  sourceFilesByRepo: Record<string, RepositorySourceFile[]>;
}
