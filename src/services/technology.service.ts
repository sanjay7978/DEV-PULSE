import { uniqueSorted } from "@/lib/utils";
import type { GitHubProfileData, Technology, TechnologyProfile } from "@/types";

const technologyCategories: Record<string, Technology["category"]> = {
  react: "framework", nextjs: "framework", next: "framework", vue: "framework",
  angular: "framework", svelte: "framework", django: "framework", flask: "framework",
  rails: "framework", spring: "framework", express: "framework", tailwindcss: "library",
  tailwind: "library", prisma: "library", graphql: "library", redux: "library",
  docker: "tool", kubernetes: "tool", vite: "tool", webpack: "tool", git: "tool",
  aws: "platform", azure: "platform", gcp: "platform", firebase: "platform", vercel: "platform",
};

function displayName(topic: string): string {
  const names: Record<string, string> = {
    nextjs: "Next.js", nodejs: "Node.js", typescript: "TypeScript", javascript: "JavaScript",
    tailwindcss: "Tailwind CSS", graphql: "GraphQL", postgresql: "PostgreSQL",
    mongodb: "MongoDB", kubernetes: "Kubernetes", firebase: "Firebase",
  };
  return names[topic] ?? topic.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

export function extractTechnologies(data: GitHubProfileData): TechnologyProfile {
  const languages: Record<string, number> = {};
  const evidence = new Map<string, Set<string>>();

  for (const [repository, repositoryLanguages] of Object.entries(data.languagesByRepo)) {
    for (const [language, bytes] of Object.entries(repositoryLanguages)) {
      languages[language] = (languages[language] ?? 0) + bytes;
      const key = language.toLowerCase();
      const repositories = evidence.get(key) ?? new Set<string>();
      repositories.add(repository);
      evidence.set(key, repositories);
    }
  }

  const topics = uniqueSorted(data.repositories.flatMap((repository) => repository.topics ?? []));
  for (const repository of data.repositories) {
    for (const topic of repository.topics ?? []) {
      const key = topic.toLowerCase();
      const repositories = evidence.get(key) ?? new Set<string>();
      repositories.add(repository.full_name);
      evidence.set(key, repositories);
    }
  }

  const languageKeys = new Set(Object.keys(languages).map((language) => language.toLowerCase()));
  const technologies = [...evidence.entries()]
    .map(([key, repositories]): Technology => ({
      name: languageKeys.has(key)
        ? Object.keys(languages).find((language) => language.toLowerCase() === key) ?? displayName(key)
        : displayName(key),
      category: languageKeys.has(key) ? "language" : technologyCategories[key] ?? "other",
      evidence: [...repositories].sort(),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return { technologies, languages, topics };
}
