import { uniqueSorted } from "@/lib/utils";
import type { GitHubProfileData, Technology, TechnologyCategories, TechnologyProfile } from "@/types";

type Category = keyof TechnologyCategories;

interface TechnologyRule {
  name: string;
  category: Category;
  patterns: RegExp[];
}

const rules: TechnologyRule[] = [
  { name: "React", category: "frontend", patterns: [/\breact(?:-dom)?\b/i] },
  { name: "Next.js", category: "frontend", patterns: [/\bnext(?:\.js|js)\b/i, /["']next["']\s*:/i] },
  { name: "Vue", category: "frontend", patterns: [/\bvue(?:\.js|js)?\b/i, /["']vue["']\s*:/i] },
  { name: "Angular", category: "frontend", patterns: [/\bangular\b/i, /@angular\/core/i] },
  { name: "Tailwind CSS", category: "frontend", patterns: [/\btailwind(?:\s*css|css)?\b/i] },
  { name: "Node.js", category: "backend", patterns: [/\bnode(?:\.js|js)\b/i] },
  { name: "Express.js", category: "backend", patterns: [/\bexpress(?:\.js|js)?\b/i, /["']express["']\s*:/i] },
  { name: "NestJS", category: "backend", patterns: [/\bnestjs\b/i, /@nestjs\/core/i] },
  { name: "Django", category: "backend", patterns: [/\bdjango\b/i] },
  { name: "Flask", category: "backend", patterns: [/\bflask\b/i] },
  { name: "Spring Boot", category: "backend", patterns: [/\bspring[ -]?boot\b/i] },
  { name: "MongoDB", category: "database", patterns: [/\bmongodb\b/i, /["']mongoose["']\s*:/i] },
  { name: "PostgreSQL", category: "database", patterns: [/\bpostgres(?:ql)?\b/i, /["']pg["']\s*:/i] },
  { name: "MySQL", category: "database", patterns: [/\bmysql\b/i, /["']mysql2?["']\s*:/i] },
  { name: "Redis", category: "database", patterns: [/\bredis\b/i, /["']ioredis["']\s*:/i] },
  { name: "Supabase", category: "database", patterns: [/\bsupabase\b/i] },
  { name: "Firebase", category: "database", patterns: [/\bfirebase\b/i] },
  { name: "Docker", category: "devops", patterns: [/\bdocker\b/i, /^from\s+\S+/im] },
  { name: "Kubernetes", category: "devops", patterns: [/\bkubernetes\b/i, /\bk8s\b/i] },
  { name: "AWS", category: "devops", patterns: [/\baws\b/i, /amazon web services/i] },
  { name: "CI/CD", category: "devops", patterns: [/github\/workflows/i, /\bci\/?cd\b/i] },
  { name: "Vercel", category: "devops", patterns: [/\bvercel\b/i] },
  { name: "Netlify", category: "devops", patterns: [/\bnetlify\b/i] },
  { name: "OpenAI", category: "ai", patterns: [/\bopenai\b/i] },
  { name: "Gemini", category: "ai", patterns: [/\bgemini\b/i, /google[-_]generativeai/i, /@google\/(?:generative-ai|genai)/i] },
  { name: "LangChain", category: "ai", patterns: [/\blangchain\b/i, /@langchain\//i] },
  { name: "TensorFlow", category: "ai", patterns: [/\btensorflow\b/i] },
  { name: "PyTorch", category: "ai", patterns: [/\bpytorch\b/i, /^torch(?:==|>=|<=|~=|$)/im] },
  { name: "Jest", category: "testing", patterns: [/\bjest\b/i] },
  { name: "Vitest", category: "testing", patterns: [/\bvitest\b/i] },
  { name: "Cypress", category: "testing", patterns: [/\bcypress\b/i] },
  { name: "Playwright", category: "testing", patterns: [/\bplaywright\b/i] },
];

const topicAliases: Record<string, string> = {
  next: "Next.js", nextjs: "Next.js", "next-js": "Next.js", node: "Node.js", nodejs: "Node.js", "node-js": "Node.js",
  express: "Express.js", expressjs: "Express.js", nest: "NestJS", nestjs: "NestJS", tailwind: "Tailwind CSS", tailwindcss: "Tailwind CSS",
  postgres: "PostgreSQL", postgresql: "PostgreSQL", mongodb: "MongoDB",
  cicd: "CI/CD", "ci-cd": "CI/CD", githubactions: "CI/CD", "github-actions": "CI/CD",
  pytorch: "PyTorch", tensorflow: "TensorFlow", langchain: "LangChain",
};

const categoryForName = new Map(rules.map((rule) => [rule.name, rule.category]));

function emptyCategories(): TechnologyCategories {
  return { frontend: [], backend: [], database: [], devops: [], ai: [], testing: [] };
}

function displayName(value: string): string {
  return topicAliases[value.toLowerCase()] ?? value.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

export function extractTechnologies(data: GitHubProfileData): TechnologyProfile {
  const languages: Record<string, number> = {};
  const evidence = new Map<string, Set<string>>();
  const detectedCategories = emptyCategories();

  const addEvidence = (technology: string, repository: string) => {
    const repositories = evidence.get(technology) ?? new Set<string>();
    repositories.add(repository);
    evidence.set(technology, repositories);
  };

  for (const [repository, repositoryLanguages] of Object.entries(data.languagesByRepo)) {
    for (const [language, bytes] of Object.entries(repositoryLanguages)) {
      languages[language] = (languages[language] ?? 0) + bytes;
      addEvidence(language, repository);
    }
  }

  const topics = uniqueSorted(data.repositories.flatMap((repository) => repository.topics ?? []));
  for (const repository of data.repositories) {
    for (const topic of repository.topics ?? []) {
      const technology = displayName(topic);
      addEvidence(technology, repository.full_name);
    }
  }

  for (const [repository, files] of Object.entries(data.sourceFilesByRepo)) {
    for (const file of files) {
      const searchableContent = `${file.path}\n${file.content}`;
      if (file.path === "package.json") addEvidence("Node.js", repository);
      if (/\.github\/workflows\//i.test(file.path)) addEvidence("CI/CD", repository);
      for (const rule of rules) {
        if (rule.patterns.some((pattern) => pattern.test(searchableContent))) addEvidence(rule.name, repository);
      }
    }
  }

  const technologies = [...evidence.entries()]
    .map(([name, repositories]): Technology => ({
      name,
      category: categoryForName.has(name) ? "framework" : Object.hasOwn(languages, name) ? "language" : "other",
      evidence: [...repositories].sort(),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const technology of technologies) {
    const category = categoryForName.get(technology.name);
    if (category) detectedCategories[category].push(technology.name);
  }
  for (const category of Object.keys(detectedCategories) as Category[]) {
    detectedCategories[category] = uniqueSorted(detectedCategories[category]);
  }

  return { technologies, languages, topics, categories: detectedCategories };
}
