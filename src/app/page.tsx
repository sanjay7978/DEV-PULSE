import { Activity, Github } from "lucide-react";
import { GitHubAnalyzer } from "@/components/github-analyzer";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[34rem] bg-[radial-gradient(circle_at_top_left,var(--color-primary),transparent_42%)] opacity-[0.08]" />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <header className="flex items-center gap-2 text-sm font-semibold tracking-tight"><span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Activity aria-hidden="true" className="size-5" /></span>Dev Pulse</header>
        <section className="pb-6 pt-16 text-center sm:pb-10 sm:pt-24">
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm"><Github aria-hidden="true" className="size-3.5" />AI-powered GitHub analysis</div>
          <h1 className="mx-auto max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">See the developer behind the repositories.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">Enter a GitHub username to uncover their technical toolkit, strongest projects, and an AI-generated experience snapshot.</p>
          <GitHubAnalyzer />
        </section>
        <footer className="mt-12 border-t py-6 text-center text-xs text-muted-foreground">Built from public GitHub profile data.</footer>
      </div>
    </main>
  );
}
