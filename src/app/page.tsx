import { Activity, LayoutDashboard, ShieldCheck } from "lucide-react";
import { GitHubAnalyzer } from "@/components/github-analyzer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/20">
              <Activity aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold tracking-tight text-white">DevPulse <span className="text-primary">AI</span></p>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Developer intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
            <LayoutDashboard aria-hidden="true" className="size-4" />
            <span>Recruiter dashboard</span>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <section className="border-b border-border pb-10 sm:pb-12">
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <ShieldCheck aria-hidden="true" className="size-4" />
            Evidence-based hiring intelligence
          </div>
          <div className="grid gap-7 lg:grid-cols-[1fr_34rem] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-balance text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
                Evaluate engineering talent with clarity.
              </h1>
              <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                Turn a public GitHub profile into a structured, recruiter-ready view of technical depth, project quality, and role fit.
              </p>
            </div>
            <GitHubAnalyzer />
          </div>
        </section>
      </div>
    </main>
  );
}
