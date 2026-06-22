# Dev Pulse

An AI-powered GitHub profile analyzer built with Next.js 15 App Router, TypeScript, Tailwind CSS 4, and shadcn/ui conventions.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

The application runs at `http://localhost:3000`. Enter a public GitHub username to view a responsive profile analysis, technology toolkit, and top repositories.

## API

`POST /api/analyze`

Request:

```json
{ "username": "octocat" }
```

Example:

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H 'Content-Type: application/json' \
  -d '{"username":"octocat"}'
```

The endpoint validates the username, retrieves the public GitHub profile and up to 100 owned repositories, ignores forks and archived repositories, aggregates repository language bytes and topics, and asks Gemini for a structured profile assessment.

Successful responses use a frontend-friendly DTO and contain the five most recently updated original repositories:

```json
{
  "profile": {
    "name": "The Octocat",
    "username": "octocat",
    "avatarUrl": "https://avatars.githubusercontent.com/u/583231?v=4",
    "bio": null,
    "followers": 10000,
    "following": 9,
    "publicRepos": 8
  },
  "repositories": [
    {
      "name": "Hello-World",
      "description": "My first repository on GitHub!",
      "language": "JavaScript",
      "stars": 42,
      "forks": 10,
      "url": "https://github.com/octocat/Hello-World"
    }
  ],
  "technologies": ["JavaScript"],
  "categories": {
    "frontend": [],
    "backend": ["Node.js"],
    "database": [],
    "devops": [],
    "ai": [],
    "testing": []
  },
  "summary": "A concise AI-generated profile summary.",
  "experienceLevel": "Intermediate",
  "score": 84,
  "breakdown": {
    "repositoryQuality": 28,
    "projectComplexity": 21,
    "skillDiversity": 17,
    "activity": 10,
    "engineeringPractices": 8
  }
}
```

Errors have a stable shape:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Invalid GitHub username" } }
```

## Environment variables

- `GEMINI_API_KEY` — required; Google Gemini API key.
- `GEMINI_MODEL` — optional; defaults to `gemini-2.5-flash`.
- `GITHUB_TOKEN` — optional but strongly recommended to increase GitHub API rate limits. No repository scopes are needed for public profiles.

Keep credentials in `.env.local`; it is ignored by Git.

## Architecture

```text
src/
├── app/
│   ├── api/analyze/route.ts    # HTTP boundary and error mapping
│   ├── globals.css             # Tailwind CSS 4 and theme variables
│   ├── layout.tsx
│   └── page.tsx                # Responsive analyzer page
├── components/
│   ├── analysis-loading.tsx    # Accessible loading skeleton
│   ├── analysis-results.tsx    # Profile analysis results
│   ├── github-analyzer.tsx     # Client state and API integration
│   ├── search-form.tsx         # Username form
│   └── ui/                     # shadcn/ui primitives
├── lib/
│   ├── env.ts                  # validated server-only configuration
│   ├── errors.ts               # application error model
│   ├── utils.ts                # shadcn cn() and common helpers
│   └── validation.ts           # request and GitHub username validation
├── services/
│   ├── gemini.service.ts       # Gemini REST integration
│   ├── github.service.ts       # GitHub REST integration
│   ├── scoring.service.ts      # Deterministic developer intelligence score
│   └── technology.service.ts   # deterministic technology extraction
└── types/
    ├── analysis.ts
    ├── github.ts
    └── index.ts
```

The API route is kept thin. Services own external calls and deterministic extraction, while shared types define the contract between each layer. Technology detection uses repository language statistics, topics, and a bounded scan of `package.json`, `requirements.txt`, `Dockerfile`, `README.md`, and GitHub workflow YAML from the 20 most recently updated original repositories. Detected skills are grouped into frontend, backend, database, DevOps, AI/ML, and testing categories. The developer intelligence score is deterministic and capped at 100: repository quality (30), project complexity (25), skill diversity (20), activity (15), and engineering practices (10). Gemini uses JSON response schema enforcement so consumers receive predictable fields. The client uses local React state for the single request lifecycle: idle, loading, error, or results.

## Verification

```bash
npm run typecheck
npm run lint
npm run build
```

To check validation without consuming either external API, send an invalid username:

```bash
curl -i -X POST http://localhost:3000/api/analyze \
  -H 'Content-Type: application/json' \
  -d '{"username":"bad--username"}'
```

This should return HTTP 400 with `VALIDATION_ERROR`.
