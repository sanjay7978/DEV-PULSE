# Dev Pulse

Backend foundation for an AI-powered GitHub profile analyzer. Built with Next.js 15 App Router, TypeScript, Tailwind CSS 4, and shadcn/ui conventions.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

The application runs at `http://localhost:3000`. The root page is intentionally only a basic health-style placeholder; landing and dashboard UI are outside this implementation.

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
│   └── page.tsx                # Deliberately minimal placeholder
├── components/ui/              # shadcn/ui components can be generated here
├── hooks/                      # shared React hooks
├── lib/
│   ├── env.ts                  # validated server-only configuration
│   ├── errors.ts               # application error model
│   ├── utils.ts                # shadcn cn() and common helpers
│   └── validation.ts           # request and GitHub username validation
├── services/
│   ├── gemini.service.ts       # Gemini REST integration
│   ├── github.service.ts       # GitHub REST integration
│   └── technology.service.ts   # deterministic technology extraction
└── types/
    ├── analysis.ts
    ├── github.ts
    └── index.ts
```

The API route is kept thin. Services own external calls and deterministic extraction, while shared types define the contract between each layer. Gemini uses JSON response schema enforcement so consumers receive predictable fields.

## Verification

```bash
npm run typecheck
npm run build
```

To check validation without consuming either external API, send an invalid username:

```bash
curl -i -X POST http://localhost:3000/api/analyze \
  -H 'Content-Type: application/json' \
  -d '{"username":"bad--username"}'
```

This should return HTTP 400 with `VALIDATION_ERROR`.
