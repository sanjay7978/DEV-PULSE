import { Activity, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { isValidSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

export default async function Home() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const hasValidSession = await isValidSessionToken(sessionToken);

  if (hasValidSession) {
    redirect("/dashboard");
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,color-mix(in_oklab,var(--primary)_28%,transparent),transparent_42%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,color-mix(in_oklab,var(--card)_75%,transparent),transparent)]" />

      <section className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
              <Activity aria-hidden="true" className="size-6" />
            </span>
            <div>
              <p className="text-lg font-semibold tracking-tight text-white">
                DevPulse <span className="text-primary">AI</span>
              </p>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Developer intelligence
              </p>
            </div>
          </div>
        </div>

        <Card className="rounded-2xl border-border/80 bg-card/85 shadow-2xl shadow-black/25 backdrop-blur">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <ShieldCheck aria-hidden="true" className="size-3.5" />
              Secure access
            </div>

            <h1 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Sign in to continue to DevPulse.
            </h1>
            <p className="mt-4 text-pretty text-sm leading-6 text-muted-foreground sm:text-base">
              Analyze GitHub profiles, uncover developer strengths, and turn public engineering signals into recruiter-ready intelligence.
            </p>

            <Button asChild className="mt-8 h-12 w-full rounded-xl bg-white text-slate-950 shadow-lg shadow-black/20 transition hover:bg-slate-100">
              <a href="/api/auth/login">
                <GoogleIcon />
                Continue with Google
                <ArrowRight aria-hidden="true" className="size-4" />
              </a>
            </Button>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-background/55 p-4 text-sm text-muted-foreground">
              <Sparkles aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
              <p>Use your Google account to access the DevPulse workspace.</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
