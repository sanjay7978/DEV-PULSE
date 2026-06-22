import type { DeveloperScore, GitHubProfileData, TechnologyProfile } from "@/types";

const complexitySignals: Array<{ weight: number; pattern: RegExp }> = [
  { weight: 4, pattern: /\b(auth(?:entication|orization)?|oauth|nextauth|passport|clerk|jwt)\b/i },
  { weight: 3, pattern: /\b(rest(?:ful)? api|graphql|api integration|axios|fetch\s*\()\b/i },
  { weight: 3, pattern: /\b(websocket|socket\.io|realtime|real-time|live updates?)\b/i },
  { weight: 3, pattern: /\b(stripe|paypal|payment|checkout|billing)\b/i },
  { weight: 2, pattern: /\b(file upload|upload files?|multer|cloudinary|presigned|multipart)\b/i },
  { weight: 2, pattern: /\b(rbac|role.based access|permissions?|access control)\b/i },
];

const clamp = (value: number, maximum: number) => Math.min(maximum, Math.max(0, Math.round(value)));

function ratio(items: string[], pattern: RegExp): number {
  if (items.length === 0) return 0;
  return items.filter((item) => pattern.test(item)).length / items.length;
}

export function calculateDeveloperScore(
  github: GitHubProfileData,
  technologyProfile: TechnologyProfile,
  now = new Date(),
): DeveloperScore {
  const repositoryTexts = Object.entries(github.sourceFilesByRepo).map(([repository, files]) => {
    const metadata = github.repositories.find((item) => item.full_name === repository);
    return [
      repository,
      files.map((file) => `${file.path}\n${file.content}`).join("\n"),
      metadata?.homepage ?? "",
    ].join("\n");
  });
  const readmes = Object.values(github.sourceFilesByRepo)
    .map((files) => files.find((file) => /^readme\.md$/i.test(file.path))?.content)
    .filter((content): content is string => content !== undefined);
  const scannedRepositoryCount = Math.max(Object.keys(github.sourceFilesByRepo).length, 1);
  const readmeCoverage = readmes.length / scannedRepositoryCount;
  const repositoryQuality = clamp(
    readmeCoverage * 8
      + ratio(readmes, /(^|\n)#{1,4}\s+(documentation|usage|features|api|architecture|examples?)/im) * 5
      + ratio(readmes, /!\[[^\]]*]\([^)]+\)|<img\s/i) * 4
      + ratio(readmes, /(^|\n)#{1,4}\s+(installation|setup|getting started)|\b(npm install|pnpm install|yarn install|pip install)\b/im) * 6
      + ratio(repositoryTexts, /https?:\/\/(?:[\w-]+\.)?(?:vercel\.app|netlify\.app|render\.com|herokuapp\.com)|\b(live demo|deployed at|deployment)\b/i) * 7,
    30,
  );

  const allEvidence = repositoryTexts.join("\n");
  let complexityValue = complexitySignals.reduce(
    (total, signal) => total + (signal.pattern.test(allEvidence) ? signal.weight : 0),
    0,
  );
  if (technologyProfile.categories.database.length > 0) complexityValue += 4;
  if (technologyProfile.categories.ai.length > 0) complexityValue += 4;
  const projectComplexity = clamp(complexityValue, 25);

  const representedCategories = Object.values(technologyProfile.categories).filter((items) => items.length > 0).length;
  const skillDiversity = clamp(
    representedCategories * 2 + Math.min(8, (technologyProfile.technologies.length / 15) * 8),
    20,
  );

  const timestamps = github.repositories
    .map((repository) => repository.pushed_at ? new Date(repository.pushed_at) : undefined)
    .filter((date): date is Date => date !== undefined && !Number.isNaN(date.getTime()));
  const ageInDays = (date: Date) => (now.getTime() - date.getTime()) / 86_400_000;
  const recentRatio = timestamps.length === 0 ? 0 : timestamps.filter((date) => ageInDays(date) <= 180).length / timestamps.length;
  const activeRatio = timestamps.length === 0 ? 0 : timestamps.filter((date) => ageInDays(date) <= 365).length / timestamps.length;
  const activeMonths = new Set(
    timestamps
      .filter((date) => ageInDays(date) <= 365)
      .map((date) => `${date.getUTCFullYear()}-${date.getUTCMonth()}`),
  ).size;
  const activity = clamp(recentRatio * 6 + activeRatio * 5 + Math.min(4, (activeMonths / 6) * 4), 15);

  const hasSourcePath = (pattern: RegExp) => Object.values(github.sourceFilesByRepo)
    .flat()
    .some((file) => pattern.test(file.path));
  const engineeringPractices = clamp(
    (Object.hasOwn(technologyProfile.languages, "TypeScript") ? 2 : 0)
      + (technologyProfile.categories.devops.includes("Docker") ? 2 : 0)
      + (technologyProfile.categories.testing.length > 0 ? 2 : 0)
      + (hasSourcePath(/\.github\/workflows\/.*\.ya?ml$/i) ? 2 : 0)
      + (technologyProfile.categories.devops.includes("CI/CD") ? 2 : 0),
    10,
  );

  const breakdown = {
    repositoryQuality,
    projectComplexity,
    skillDiversity,
    activity,
    engineeringPractices,
  };
  return { score: Object.values(breakdown).reduce((total, value) => total + value, 0), breakdown };
}
