import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AnalysisLoading() {
  return (
    <div aria-label="Analyzing GitHub profile" aria-live="polite" className="col-span-full mt-10 space-y-10 border-t border-border pt-10">
      <span className="sr-only">Analyzing GitHub profile…</span>
      <Card><CardContent className="grid gap-7 pt-5 sm:grid-cols-[6rem_1fr] sm:pt-6 lg:grid-cols-[6rem_1fr_22rem]"><Skeleton className="size-20 rounded-xl sm:size-24" /><div className="space-y-3"><Skeleton className="h-8 w-56" /><Skeleton className="h-4 w-32" /><Skeleton className="h-4 w-full max-w-lg" /><div className="flex gap-2 pt-2"><Skeleton className="h-6 w-20" /><Skeleton className="h-6 w-24" /><Skeleton className="h-6 w-16" /></div></div><div className="space-y-3 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0"><Skeleton className="h-10 w-24" /><Skeleton className="h-2 w-full" /><Skeleton className="h-2 w-full" /><Skeleton className="h-2 w-full" /></div></CardContent></Card>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <Card key={index} className="p-5"><Skeleton className="h-4 w-28" /><Skeleton className="mt-5 h-9 w-20" /><Skeleton className="mt-2 h-3 w-36" /></Card>)}</div>
      <div className="grid gap-4 lg:grid-cols-2"><Skeleton className="h-[32rem] rounded-xl" /><Skeleton className="h-[32rem] rounded-xl" /></div>
    </div>
  );
}
