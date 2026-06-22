import type { TechnologyCategories } from "@/types";

export interface SkillCoverageDatum {
  category: string;
  value: number;
}

const categoryDefinitions: Array<{
  key: keyof TechnologyCategories;
  label: string;
  taxonomySize: number;
}> = [
  { key: "frontend", label: "Frontend", taxonomySize: 5 },
  { key: "backend", label: "Backend", taxonomySize: 6 },
  { key: "database", label: "Database", taxonomySize: 6 },
  { key: "ai", label: "AI/ML", taxonomySize: 5 },
  { key: "devops", label: "DevOps", taxonomySize: 6 },
  { key: "testing", label: "Testing", taxonomySize: 4 },
];

export function getSkillCoverageData(categories: TechnologyCategories): SkillCoverageDatum[] {
  return categoryDefinitions.map(({ key, label, taxonomySize }) => ({
    category: label,
    value: Math.min(100, Math.round((categories[key].length / taxonomySize) * 100)),
  }));
}
