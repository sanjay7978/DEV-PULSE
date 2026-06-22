import { BookOpen, ExternalLink, GitFork, Star, Users } from "lucide-react";
import type { AnalysisResult } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AnalysisResults({ result }: { result: AnalysisResult }) {
  const { profile } = result;
  return (
    <section aria-label={`Analysis for ${profile.username}`} className="mt-10 grid gap-5 lg:grid-cols-3">
      <Card className="h-fit overflow-hidden lg:sticky lg:top-6">
        <div className="h-24 bg-gradient-to-br from-primary/20 via-accent to-secondary" />
        <CardHeader className="-mt-16 items-center text-center">
          <img src={profile.avatarUrl} alt={`${profile.username}'s avatar`} className="size-24 rounded-full border-4 border-card bg-card object-cover shadow-md" />
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
          <CardHeader><div className="flex items-center gap-2"><Users aria-hidden="true" className="size-5 text-primary" /><CardTitle>Developer summary</CardTitle></div></CardHeader>
          <CardContent><p className="text-sm leading-7 text-muted-foreground sm:text-base">{result.summary}</p></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Technology toolkit</CardTitle><CardDescription>Languages, frameworks, and tools found across public repositories.</CardDescription></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {result.technologies.length > 0 ? result.technologies.map((technology) => <Badge key={technology}>{technology}</Badge>) : <p className="text-sm text-muted-foreground">No technologies detected.</p>}
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
