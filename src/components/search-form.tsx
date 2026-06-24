"use client";

import { FormEvent } from "react";
import { Github, LoaderCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchFormProps {
  username: string;
  isLoading: boolean;
  onUsernameChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function SearchForm({ username, isLoading, onUsernameChange, onSubmit }: SearchFormProps) {
  return (
    <form className="rounded-xl border border-border bg-card p-2 shadow-xl shadow-black/10 sm:flex" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="github-username">GitHub username</label>
      <div className="relative flex-1">
        <Github aria-hidden="true" className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="github-username"
          name="username"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="Enter GitHub username"
          value={username}
          disabled={isLoading}
          onChange={(event) => onUsernameChange(event.target.value)}
          className="h-12 border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0"
          required
        />
      </div>
      <Button type="submit" disabled={isLoading || !username.trim()} className="mt-2 h-12 rounded-lg px-6 sm:mt-0 sm:min-w-40">
        {isLoading ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <Search aria-hidden="true" className="size-4" />}
        {isLoading ? "Analyzing…" : "Analyze profile"}
      </Button>
    </form>
  );
}
