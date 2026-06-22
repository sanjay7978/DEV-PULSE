import { AlertTriangle, BriefcaseBusiness, Check, FileSearch, Sparkles } from "lucide-react";
import type { RecruiterInsights } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function DeveloperInsights({ insights }: { insights: RecruiterInsights }) {
  return (
    <section aria-labelledby="developer-insights-title" className="space-y-5">
      <div>
        <h2 id="developer-insights-title" className="text-xl font-semibold tracking-tight">Developer Insights</h2>
        <p className="mt-1 text-sm text-muted-foreground">A concise recruiter briefing grounded in public GitHub evidence.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Check aria-hidden="true" className="size-5 text-emerald-600" />Strengths</CardTitle></CardHeader>
          <CardContent><ul className="space-y-3">{insights.strengths.map((strength) => <li key={strength} className="flex items-start gap-2 text-sm"><Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-emerald-600" /><span>{strength}</span></li>)}</ul></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle aria-hidden="true" className="size-5 text-amber-600" />Areas With Limited Evidence</CardTitle><CardDescription>Indicates visibility in public repositories, not ability.</CardDescription></CardHeader>
          <CardContent>{insights.limitedEvidence.length > 0 ? <ul className="space-y-3">{insights.limitedEvidence.map((area) => <li key={area} className="flex items-start gap-2 text-sm"><AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-amber-600" /><span>{area}</span></li>)}</ul> : <p className="text-sm text-muted-foreground">No notable evidence gaps identified in the analyzed categories.</p>}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><FileSearch aria-hidden="true" className="size-5 text-primary" />Project Insights</CardTitle></CardHeader>
        <CardContent><p className="whitespace-pre-line text-sm leading-7 text-muted-foreground sm:text-base">{insights.projectInsights}</p></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><BriefcaseBusiness aria-hidden="true" className="size-5 text-primary" />Recommended Roles</CardTitle><CardDescription>Roles supported by technologies and patterns visible in public projects.</CardDescription></CardHeader>
        <CardContent className="flex flex-wrap gap-2">{insights.recommendedRoles.map((role) => <Badge key={role} className="px-3 py-1.5">{role}</Badge>)}</CardContent>
      </Card>

      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/40">
        <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles aria-hidden="true" className="size-5 text-primary" />Profile Assessment</CardTitle></CardHeader>
        <CardContent><p className="text-lg font-semibold tracking-tight">{insights.profileAssessment}</p></CardContent>
      </Card>
    </section>
  );
}
