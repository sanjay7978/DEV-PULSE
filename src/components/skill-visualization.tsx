"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { TechnologyCategories } from "@/types";
import { getSkillCoverageData } from "@/lib/skill-coverage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SkillVisualizationProps {
  categories: TechnologyCategories;
}

export function SkillVisualization({ categories }: SkillVisualizationProps) {
  const data = getSkillCoverageData(categories);

  return (
    <section aria-labelledby="skill-breakdown-title" className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle id="skill-breakdown-title">Skill Breakdown</CardTitle>
          <CardDescription>Coverage across the technologies detected in each engineering category.</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {data.map(({ category, value }) => (
              <div key={category}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <dt className="font-medium">{category}</dt>
                  <dd className="tabular-nums text-muted-foreground">{value}</dd>
                </div>
                <div
                  role="progressbar"
                  aria-label={`${category} skill coverage`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={value}
                  className="h-2.5 overflow-hidden rounded-full bg-muted"
                >
                  <div className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary transition-[width] duration-500 ease-out" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Technical Strengths Radar</CardTitle>
          <CardDescription>A quick visual comparison of category coverage.</CardDescription>
        </CardHeader>
        <CardContent className="h-[20rem] px-2 pb-4 sm:h-[24rem] sm:px-6">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} outerRadius="72%" accessibilityLayer>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="category" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Tooltip
                cursor={false}
                contentStyle={{
                  background: "color-mix(in oklab, var(--card) 88%, transparent)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.75rem",
                  boxShadow: "0 12px 32px rgb(15 23 42 / 0.12)",
                  backdropFilter: "blur(12px)",
                }}
                formatter={(value) => [`${Number(value)}%`, "Coverage"]}
              />
              <Radar
                name="Skill coverage"
                dataKey="value"
                stroke="var(--primary)"
                fill="var(--primary)"
                fillOpacity={0.24}
                strokeWidth={2}
                dot={{ fill: "var(--primary)", r: 3 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </section>
  );
}
