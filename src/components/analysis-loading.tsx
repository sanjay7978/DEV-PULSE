import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AnalysisLoading() {
  return (
    <div aria-label="Analyzing GitHub profile" aria-live="polite" className="mt-10 grid gap-5 lg:grid-cols-3">
      <span className="sr-only">Analyzing GitHub profile…</span>
      <Card className="lg:col-span-1">
        <CardHeader className="items-center"><Skeleton className="size-24 rounded-full" /><Skeleton className="mt-3 h-6 w-36" /><Skeleton className="h-4 w-24" /></CardHeader>
        <CardContent className="space-y-3"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-4/5" /><Skeleton className="mt-5 h-16 w-full" /></CardContent>
      </Card>
      <div className="space-y-5 lg:col-span-2">
        <Card><CardHeader><Skeleton className="h-6 w-40" /></CardHeader><CardContent className="space-y-3"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-6 w-32" /></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2"><Skeleton className="h-28 w-full" /><Skeleton className="h-28 w-full" /></CardContent></Card>
      </div>
    </div>
  );
}
