"use client";

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import type { TechnologyCategories } from "@/types";
import { getSkillCoverageData } from "@/lib/skill-coverage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SkillVisualization({ categories }: { categories: TechnologyCategories }) {
  const data = getSkillCoverageData(categories);

  return (
    <Card className="h-full">
      <CardHeader className="border-b border-border">
        <CardTitle>Skill diversity</CardTitle>
        <CardDescription>Relative technical coverage across core engineering categories.</CardDescription>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-5">
        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} outerRadius="68%" accessibilityLayer>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="category" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Tooltip cursor={false} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "0.625rem", boxShadow: "0 12px 28px rgb(0 0 0 / 0.28)" }} formatter={(value) => [`${Number(value)}%`, "Coverage"]} />
              <Radar name="Skill coverage" dataKey="value" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.14} strokeWidth={2} dot={{ fill: "var(--primary)", r: 3 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <dl className="grid gap-x-6 gap-y-3 border-t border-border pt-5 sm:grid-cols-2">
          {data.map(({ category, value }) => <div key={category}><div className="mb-1.5 flex items-center justify-between gap-3 text-xs"><dt className="font-medium text-slate-300">{category}</dt><dd className="tabular-nums text-slate-500">{value}%</dd></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${value}%` }} /></div></div>)}
        </dl>
      </CardContent>
    </Card>
  );
}
