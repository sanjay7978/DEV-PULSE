import Image from "next/image";
import dynamic from "next/dynamic";
import { BookOpen, ExternalLink, GitFork, Gauge, Star } from "lucide-react";
import type { AnalysisResult, TechnologyCategories } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreInfoHoverCard } from "@/components/score-info-hover-card";
import { DeveloperInsights } from "@/components/developer-insights";

const SkillVisualization = dynamic(
  () => import("@/components/skill-visualization").then((module) => module.SkillVisualization),
  {
    ssr: false,
    loading: () => <Card className="h-80 animate-pulse bg-muted/40" aria-label="Loading skill visualization" />,
  },
);

export function AnalysisResults({ result }: { result: AnalysisResult }) {
  const { profile } = result;
  const categoryLabels = {
    frontend: "Frontend",
    backend: "Backend",
    database: "Database",
    devops: "DevOps",
    ai: "AI / ML",
    testing: "Testing",
  } as const;
  const categoryEntries = Object.entries(result.categories) as Array<[keyof TechnologyCategories, string[]]>;
  const categorizedTechnologies = new Set(categoryEntries.flatMap(([, technologies]) => technologies));
  const uncategorizedTechnologies = result.technologies.filter((technology) => !categorizedTechnologies.has(technology));
  const scoreItems = [
    ["Repository Quality", result.breakdown.repositoryQuality, 30, "Measures documentation quality, README completeness, setup instructions, deployment links, screenshots, and overall project presentation."],
    ["Project Complexity", result.breakdown.projectComplexity, 25, "Measures advanced engineering features such as authentication, databases, API integrations, AI functionality, realtime systems, file uploads, and application architecture."],
    ["Skill Diversity", result.breakdown.skillDiversity, 20, "Measures technology coverage across frontend, backend, databases, DevOps, AI/ML, and testing ecosystems."],
    ["Activity", result.breakdown.activity, 15, "Measures repository maintenance, recent project updates, development consistency, and active contribution patterns."],
    ["Engineering Practices", result.breakdown.engineeringPractices, 10, "Measures use of TypeScript, testing frameworks, Docker, GitHub Actions, CI/CD workflows, and professional development practices."],
  ] as const;
  return (
    <section aria-label={`Analysis for ${profile.username}`} className="mt-10 grid gap-5 lg:grid-cols-3">
      <Card className="h-fit overflow-hidden lg:sticky lg:top-6">
        <div className="h-24 bg-gradient-to-br from-primary/20 via-accent to-secondary" />
        <CardHeader className="-mt-16 items-center text-center">
          <Image src={profile.avatarUrl} alt={`${profile.username}'s avatar`} width={96} height={96} className="size-24 rounded-full border-4 border-card bg-card object-cover shadow-md" />
          <div className="pt-2">
            <CardTitle className="text-xl">{profile.name ?? profile.username}</CardTitle>
            <CardDescription>@{profile.username}</CardDescription>
          </div>
          <Badge className="mt-2 bg-primary/10 text-primary">{result.experienceLevel}</Badge>
        </CardHeader>
        <CardContent>
          {profile.bio && <p className="mb-6 text-center text-sm leading-relaxed text-muted-foreground">{profile.bio}</p>}
          <dl className="grid grid-cols-3 divide-x divide-border rounded-xl border bg-muted/30 py-3 text-center">
            <div><dt className="text-xs text-muted-foreground">Followers</dt><dd className="mt-1 font-semibold">{profile.followers.toLocaleString()}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Following</dt><dd className="mt-1 font-semibold">{profile.following.toLocaleString()}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Repos</dt><dd className="mt-1 font-semibold">{profile.publicRepos.toLocaleString()}</dd></div>
          </dl>
        </CardContent>
      </Card>

      <div className="space-y-5 lg:col-span-2">
        <Card>
          <CardHeader><div className="flex items-center gap-2"><Gauge aria-hidden="true" className="size-5 text-primary" /><CardTitle>Developer intelligence score</CardTitle></div><CardDescription>Evidence-based score across repository quality, complexity, skills, activity, and engineering practices.</CardDescription></CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-[8rem_1fr] sm:items-center">
            <div className="mx-auto grid size-28 place-items-center rounded-full border-8 border-primary/15 bg-primary/5 text-center"><div><strong className="block text-3xl text-primary">{result.score}</strong><span className="text-xs text-muted-foreground">out of 100</span></div></div>
            <dl className="space-y-3">
              {scoreItems.map(([label, value, maximum, description]) => (
                <div key={label}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-xs"><dt><ScoreInfoHoverCard title={label} description={description} /></dt><dd className="text-muted-foreground">{value}/{maximum}</dd></div>
                  <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={maximum} aria-valuenow={value} className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${(value / maximum) * 100}%` }} /></div>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <SkillVisualization categories={result.categories} />

        <DeveloperInsights insights={result.insights} />

        <Card>
          <CardHeader><CardTitle>Technology toolkit</CardTitle><CardDescription>Languages, frameworks, and tools found across public repositories.</CardDescription></CardHeader>
          <CardContent className="space-y-5">
            {categoryEntries.some(([, technologies]) => technologies.length > 0) ? (
              categoryEntries.map(([category, technologies]) => technologies.length > 0 && (
                <div key={category}>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{categoryLabels[category]}</h3>
                  <div className="flex flex-wrap gap-2">{technologies.map((technology) => <Badge key={technology}>{technology}</Badge>)}</div>
                </div>
              ))
            ) : <p className="text-sm text-muted-foreground">No categorized technologies detected.</p>}
            {uncategorizedTechnologies.length > 0 && (
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Languages & other</h3>
                <div className="flex flex-wrap gap-2">{uncategorizedTechnologies.map((technology) => <Badge key={technology}>{technology}</Badge>)}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><div className="flex items-center gap-2"><BookOpen aria-hidden="true" className="size-5 text-primary" /><CardTitle>Top repositories</CardTitle></div><CardDescription>Five recently updated, original public repositories.</CardDescription></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {result.repositories.length > 0 ? result.repositories.map((repository) => (
              <a key={repository.url} href={repository.url} target="_blank" rel="noreferrer" className="group flex min-h-36 flex-col rounded-xl border border-border p-4 transition hover:border-primary/40 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <div className="flex items-start justify-between gap-3"><h3 className="font-semibold group-hover:text-primary">{repository.name}</h3><ExternalLink aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" /></div>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{repository.description ?? "No description provided."}</p>
                <div className="mt-auto flex flex-wrap items-center gap-4 pt-4 text-xs text-muted-foreground">
                  {repository.language && <span>{repository.language}</span>}
                  <span className="flex items-center gap-1"><Star aria-hidden="true" className="size-3.5" />{repository.stars}</span>
                  <span className="flex items-center gap-1"><GitFork aria-hidden="true" className="size-3.5" />{repository.forks}</span>
                </div>
              </a>
            )) : <p className="text-sm text-muted-foreground">No repositories found.</p>}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
