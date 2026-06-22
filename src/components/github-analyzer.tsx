"use client";

import { FormEvent, useState } from "react";
import { CircleAlert } from "lucide-react";
import type { AnalysisResult, ApiErrorResponse } from "@/types";
import { Alert } from "@/components/ui/alert";
import { AnalysisLoading } from "@/components/analysis-loading";
import { AnalysisResults } from "@/components/analysis-results";
import { SearchForm } from "@/components/search-form";

export function GitHubAnalyzer() {
  const [username, setUsername] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function analyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedUsername = username.trim();
    if (!normalizedUsername || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: normalizedUsername }),
      });
      const data = (await response.json()) as AnalysisResult | ApiErrorResponse;
      if (!response.ok || "error" in data) {
        throw new Error("error" in data ? data.error.message : "Unable to analyze this profile.");
      }
      setResult(data);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <SearchForm username={username} isLoading={isLoading} onUsernameChange={setUsername} onSubmit={analyze} />
      {error && <Alert className="mx-auto mt-5 flex max-w-2xl items-start gap-3"><CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" /><div><p className="font-semibold">Analysis failed</p><p className="mt-1 text-destructive/80">{error}</p></div></Alert>}
      {isLoading && <AnalysisLoading />}
      {result && <AnalysisResults result={result} />}
    </>
  );
}
