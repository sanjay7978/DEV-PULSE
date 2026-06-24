import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Check,
  Code2,
  ExternalLink,
  GitFork,
  Github,
  Layers3,
  Star,
} from "lucide-react";
import type { AnalysisResult, TechnologyCategories } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreInfoHoverCard } from "@/components/score-info-hover-card";

const SkillVisualization = dynamic(
  () => import("@/components/skill-visualization").then((module) => module.SkillVisualization),
  {
    ssr: false,
    loading: () => <Card className="h-full min-h-96 animate-pulse bg-card" aria-label="Loading skill visualization" />,
  },
);

const categoryLabels = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  devops: "DevOps",
  ai: "AI / ML",
  testing: "Testing",
} as const;

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mb-5 sm:mb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">{title}</h2>
      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

export function AnalysisResults({ result }: { result: AnalysisResult }) {
  const { profile } = result;
  const categoryEntries = Object.entries(result.categories) as Array<[keyof TechnologyCategories, string[]]>;
  const categorizedTechnologies = new Set(categoryEntries.flatMap(([, technologies]) => technologies));
  const uncategorizedTechnologies = result.technologies.filter((technology) => !categorizedTechnologies.has(technology));
  const featuredStars = result.repositories.reduce((sum, repository) => sum + repository.stars, 0);
  const scoreItems = [
    ["Repository quality", result.breakdown.repositoryQuality, 30, "Documentation, setup guidance, deployment links, screenshots, and overall project presentation."],
    ["Project complexity", result.breakdown.projectComplexity, 25, "Advanced features, integrations, application architecture, and engineering depth."],
    ["Skill diversity", result.breakdown.skillDiversity, 20, "Coverage across frontend, backend, databases, DevOps, AI/ML, and testing."],
    ["Activity", result.breakdown.activity, 15, "Repository maintenance, recent project updates, and contribution patterns."],
    ["Engineering practices", result.breakdown.engineeringPractices, 10, "TypeScript, testing, Docker, automation, and CI/CD usage."],
  ] as const;
  const metrics = [
    { label: "Public repositories", value: profile.publicRepos, detail: "Visible on GitHub", icon: BookOpen },
    { label: "Featured repo stars", value: featuredStars, detail: "Across analyzed projects", icon: Star },
    { label: "Technologies found", value: result.technologies.length, detail: "Languages, tools & frameworks", icon: Code2 },
    { label: "Activity signal", value: `${result.breakdown.activity}/15`, detail: "Recency & consistency", icon: Activity },
  ];

  return (
    <section aria-label={`Analysis for ${profile.username}`} className="col-span-full mt-10 space-y-12 border-t border-border pt-10 sm:mt-12 sm:space-y-14 sm:pt-12">
      {!result.aiInsightsAvailable && (
        <div role="status" className="flex gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-100">
          <AlertTriangle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-amber-400" />
          <div><p className="font-medium">AI insights are temporarily unavailable.</p><p className="mt-1 text-sm text-amber-200/70">Core GitHub analysis has still been completed successfully.</p></div>
        </div>
      )}

      <Card className="overflow-hidden border-slate-700/80 shadow-xl shadow-black/10">
        <div className="grid lg:grid-cols-[1fr_25rem]">
          <div className="p-5 sm:p-7 lg:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <Image src={profile.avatarUrl} alt={`${profile.username}'s avatar`} width={96} height={96} className="size-20 rounded-xl border border-slate-700 bg-muted object-cover sm:size-24" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="truncate text-2xl font-semibold tracking-tight text-white sm:text-3xl">{profile.name ?? profile.username}</h2>
                  <Badge className="border border-blue-500/25 bg-blue-500/10 text-blue-300">{result.experienceLevel}</Badge>
                </div>
                <a href={`https://github.com/${profile.username}`} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-primary">
                  <Github aria-hidden="true" className="size-4" />@{profile.username}<ExternalLink aria-hidden="true" className="size-3.5" />
                </a>
                {profile.bio && <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">{profile.bio}</p>}
                <div className="mt-5 flex flex-wrap gap-2">
                  {result.technologies.slice(0, 6).map((technology) => <Badge key={technology} className="border border-border bg-secondary text-slate-300">{technology}</Badge>)}
                </div>
              </div>
            </div>
            <dl className="mt-7 grid grid-cols-3 gap-3 border-t border-border pt-5 sm:max-w-lg">
              <div><dt className="text-xs text-muted-foreground">Followers</dt><dd className="mt-1 text-lg font-semibold tabular-nums text-white">{profile.followers.toLocaleString()}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Following</dt><dd className="mt-1 text-lg font-semibold tabular-nums text-white">{profile.following.toLocaleString()}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Profile</dt><dd className="mt-1 text-sm font-medium text-emerald-400">Public</dd></div>
            </dl>
          </div>

          <div className="border-t border-border bg-slate-950/35 p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-8">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Intelligence score</p><p className="mt-2 text-sm text-slate-400">Composite developer signal</p></div>
              <div className="text-right"><strong className="text-5xl font-semibold tracking-tight text-white">{result.score}</strong><span className="ml-1 text-sm text-slate-500">/100</span></div>
            </div>
            <dl className="mt-7 space-y-3.5">
              {scoreItems.map(([label, value, maximum, description]) => (
                <div key={label}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-xs"><dt><ScoreInfoHoverCard title={label} description={description} /></dt><dd className="tabular-nums text-slate-500">{value}/{maximum}</dd></div>
                  <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={maximum} aria-valuenow={value} className="h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${(value / maximum) * 100}%` }} /></div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Card>

      <section>
        <SectionHeading eyebrow="Profile signals" title="Developer metrics" description="A concise view of the public evidence used in this assessment." />
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map(({ label, value, detail, icon: Icon }) => (
            <Card key={label} className="group p-5 transition duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:shadow-lg hover:shadow-black/10">
              <div className="flex items-start justify-between"><dt className="text-sm font-medium text-slate-400">{label}</dt><Icon aria-hidden="true" className="size-4 text-slate-500 transition-colors group-hover:text-primary" /></div>
              <dd className="mt-5 text-3xl font-semibold tracking-tight tabular-nums text-white">{typeof value === "number" ? value.toLocaleString() : value}</dd>
              <p className="mt-1.5 text-xs text-slate-500">{detail}</p>
            </Card>
          ))}
        </dl>
      </section>

      <section>
        <SectionHeading eyebrow="Hiring analysis" title="Recruiter intelligence" description="Role-relevant signals and technical coverage grounded in public repository evidence." />
        <div className="grid items-stretch gap-4 lg:grid-cols-2">
          <Card className="h-full">
            <CardHeader className="border-b border-border"><CardTitle>Recruiter insights</CardTitle><CardDescription>A concise briefing for profile review and candidate screening.</CardDescription></CardHeader>
            <CardContent className="space-y-6 pt-5 sm:pt-6">
              <div><h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-400">Demonstrated strengths</h3><ul className="space-y-3">{result.insights.strengths.map((strength) => <li key={strength} className="flex items-start gap-3 text-sm leading-6 text-slate-300"><Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-emerald-400" /><span>{strength}</span></li>)}</ul></div>
              {result.insights.limitedEvidence.length > 0 && <div className="border-t border-border pt-5"><h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-amber-400">Limited public evidence</h3><ul className="space-y-3">{result.insights.limitedEvidence.map((area) => <li key={area} className="flex items-start gap-3 text-sm leading-6 text-slate-400"><AlertTriangle aria-hidden="true" className="mt-1 size-4 shrink-0 text-amber-400" /><span>{area}</span></li>)}</ul></div>}
              <div className="border-t border-border pt-5"><h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Project assessment</h3><p className="whitespace-pre-line text-sm leading-6 text-slate-300">{result.insights.projectInsights}</p></div>
              <div className="rounded-lg border border-blue-500/20 bg-blue-500/[0.06] p-4"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-300">Profile assessment</p><p className="mt-2 text-sm font-medium leading-6 text-white">{result.insights.profileAssessment}</p></div>
              <div><h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500"><BriefcaseBusiness aria-hidden="true" className="size-4" />Recommended roles</h3><div className="flex flex-wrap gap-2">{result.insights.recommendedRoles.map((role) => <Badge key={role} className="border border-border bg-secondary text-slate-300">{role}</Badge>)}</div></div>
            </CardContent>
          </Card>
          <SkillVisualization categories={result.categories} />
        </div>
      </section>

      <section>
        <SectionHeading eyebrow="Project evidence" title="Featured repositories" description="The recently updated original public repositories included in this analysis." />
        <Card className="overflow-hidden">
          {result.repositories.length > 0 ? <div className="divide-y divide-border">{result.repositories.map((repository) => (
            <a key={repository.url} href={repository.url} target="_blank" rel="noreferrer" className="group grid gap-4 p-5 transition-colors hover:bg-slate-800/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
              <div className="min-w-0"><div className="flex items-center gap-2"><h3 className="truncate font-semibold text-white transition-colors group-hover:text-primary">{repository.name}</h3><ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-slate-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" /></div><p className="mt-1.5 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-400">{repository.description ?? "No description provided."}</p></div>
              <div className="flex items-center gap-4 text-xs text-slate-400 sm:justify-end">
                {repository.language && <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-blue-400" />{repository.language}</span>}
                <span className="flex items-center gap-1.5"><Star aria-hidden="true" className="size-3.5" />{repository.stars}</span>
                <span className="flex items-center gap-1.5"><GitFork aria-hidden="true" className="size-3.5" />{repository.forks}</span>
              </div>
            </a>
          ))}</div> : <p className="p-6 text-sm text-muted-foreground">No repositories found.</p>}
        </Card>
      </section>

      <section className="pb-6">
        <SectionHeading eyebrow="Technical footprint" title="Technology stack" description="Languages, frameworks, platforms, and tools detected across public projects." />
        <Card><CardContent className="grid gap-7 pt-5 sm:grid-cols-2 sm:pt-6 lg:grid-cols-3">
          {categoryEntries.map(([category, technologies]) => technologies.length > 0 && <div key={category}><h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white"><Layers3 aria-hidden="true" className="size-4 text-primary" />{categoryLabels[category]}</h3><div className="flex flex-wrap gap-2">{technologies.map((technology) => <Badge key={technology} className="border border-border bg-secondary text-slate-300">{technology}</Badge>)}</div></div>)}
          {uncategorizedTechnologies.length > 0 && <div><h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white"><Code2 aria-hidden="true" className="size-4 text-primary" />Languages & other</h3><div className="flex flex-wrap gap-2">{uncategorizedTechnologies.map((technology) => <Badge key={technology} className="border border-border bg-secondary text-slate-300">{technology}</Badge>)}</div></div>}
        </CardContent></Card>
      </section>
    </section>
  );
}
