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
    <form className="mx-auto mt-8 flex w-full max-w-2xl flex-col gap-3 sm:flex-row" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="github-username">GitHub username</label>
      <div className="relative flex-1">
        <Github aria-hidden="true" className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="github-username"
          name="username"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="Enter a GitHub username"
          value={username}
          disabled={isLoading}
          onChange={(event) => onUsernameChange(event.target.value)}
          className="pl-12"
          required
        />
      </div>
      <Button type="submit" disabled={isLoading || !username.trim()} className="sm:min-w-36">
        {isLoading ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <Search aria-hidden="true" className="size-4" />}
        {isLoading ? "Analyzing…" : "Analyze profile"}
      </Button>
    </form>
  );
}
