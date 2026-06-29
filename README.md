<div align="center">

# 🚀 DevPulse AI

### AI-powered developer intelligence. Instantly.

> Transform any GitHub profile into a recruiter-ready technical assessment in seconds.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Supabase](https://img.shields.io/badge/Supabase-BaaS-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-LLM-7C3AED?style=for-the-badge)](https://openrouter.ai/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![MIT License](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)](./LICENSE)

[Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## What is DevPulse AI?

DevPulse AI is an AI-powered developer intelligence platform that analyzes any public GitHub profile and converts it into a structured, recruiter-ready technical report. It extracts technologies, calculates an evidence-based developer intelligence score, and generates AI-driven insights — eliminating the manual, time-consuming work of reviewing repositories one by one.

Built for recruiters who need signal over noise, and developers who want their GitHub work to speak with clarity.

---

## 🎯 The Problem It Solves

Evaluating developers through GitHub profiles is slow and inconsistent.

| Without DevPulse AI | With DevPulse AI |
|---|---|
| ❌ Manually reviewing dozens of repositories | ✅ Full profile analyzed in seconds |
| ❌ No standardized evaluation criteria | ✅ Evidence-based intelligence score (0–100) |
| ❌ Hard to identify real technical depth | ✅ AI-extracted strengths and skill categories |
| ❌ Difficult to compare candidates | ✅ Structured, consistent recruiter reports |
| ❌ Strong developers get overlooked | ✅ Objective, data-driven assessment |

---

## ✨ Key Features

| Feature | Description |
|--------|-------------|
| 🔐 **Google OAuth** | Secure sign-in via Google OAuth 2.0 with server-side sessions and HttpOnly cookies |
| 🔍 **GitHub Profile Analysis** | Fetches repositories, profile metadata, stars, forks, languages, and activity signals |
| 🛠️ **Technology Detection Engine** | Auto-identifies 30+ technologies across Frontend, Backend, Languages, Databases, DevOps, and AI/ML |
| 📊 **Developer Intelligence Score** | Score (0–100) weighted across repository quality, complexity, diversity, activity, and practices |
| 🤖 **AI Insights via Gemini** | Professional summaries, experience level, technical strengths, recommended roles, project observations |
| 🗂️ **Skill Categorization** | Technologies grouped into structured domains: Frontend, Backend, DevOps, AI/ML, Mobile, Testing, Cloud |
| 📈 **Skill Coverage Visualization** | Visual breakdown of a developer's technical breadth across engineering domains |
| 💪 **Strengths & Gaps Report** | AI-identified strengths alongside areas with limited evidence — honest, not padded |
| 🔁 **AI Retry & Fallback System** | Automatic retry on Gemini failure with graceful fallback — analysis never fully breaks |
| 🛡️ **AI Rate Limiting** | Configurable time-window limiting to prevent API abuse and control cost |
| 📱 **Fully Responsive UI** | Optimized for desktop, tablet, and mobile with loading skeletons and smooth transitions |

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL, Supabase, Prisma ORM |
| **Authentication** | Google OAuth 2.0, HttpOnly Cookies, Server-side Sessions |
| **AI** | Google Gemini, OpenRouter |
| **External APIs** | GitHub REST API, Google OAuth API |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## ⚙️ How It Works

```
1. User signs in via Google OAuth 2.0
       │
2. Session created → stored in PostgreSQL → HttpOnly cookie set
       │
3. User enters any public GitHub username
       │
4. GitHub REST API → fetches profile, repositories, languages, activity
       │
5. Technology Detection Engine → identifies 30+ frameworks, tools, languages
       │
6. Intelligence Score calculated across 6 weighted categories
       │
7. Google Gemini generates AI insights:
       ├── Professional summary
       ├── Experience level estimate
       ├── Technical strengths
       ├── Areas with limited evidence
       ├── Recommended roles
       └── Project observations
       │
8. Recruiter dashboard renders the full intelligence report
```

---

## 📊 Developer Intelligence Score

Every profile receives a score between **0 and 100**, calculated across six weighted dimensions:

| Category | Weight |
|---|---|
| Repository Quality | 25% |
| Project Complexity | 20% |
| Technology Breadth | 20% |
| Development Consistency | 15% |
| Open Source Activity | 10% |
| Documentation Quality | 10% |

An interactive score explanation card is displayed alongside the score, detailing what each category measured and how the final number was reached.

---

## 📸 Screenshots

<!-- Add screenshots here -->
> _Screenshots coming soon. Clone the repo and run locally to preview the full UI (see Getting Started below)._

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- PostgreSQL database — or a free [Neon](https://neon.tech/) / [Supabase](https://supabase.com/) instance
- Google Cloud project with OAuth 2.0 credentials configured
- Google Gemini API key
- OpenRouter API key (optional, for fallback LLM routing)

---

### Environment Variables

**Frontend** — create `.env.local` in the project root:

```env
# App
NEXT_PUBLIC_APP_URL=           # e.g. http://localhost:3000
NEXT_PUBLIC_API_URL=           # e.g. http://localhost:5000

# Google OAuth
GOOGLE_CLIENT_ID=              # OAuth 2.0 Client ID from Google Cloud Console
GOOGLE_CLIENT_SECRET=          # OAuth 2.0 Client Secret
GOOGLE_REDIRECT_URI=           # e.g. http://localhost:3000/api/auth/callback

# Session
SESSION_SECRET=                # A long, random string used to sign session tokens
```

**Backend** — create `.env` inside the `/backend` directory:

```env
PORT=5000

# GitHub
GITHUB_TOKEN=                  # Personal access token for higher API rate limits

# AI
GEMINI_API_KEY=                # Google Gemini API key
OPENROUTER_API_KEY=            # OpenRouter API key (LLM fallback)

# Database
DATABASE_URL=                  # PostgreSQL connection string
SUPABASE_URL=                  # Supabase project URL
SUPABASE_ANON_KEY=             # Supabase anon/public key
SUPABASE_SERVICE_ROLE_KEY=     # Supabase service role key (server-side only)
```

---

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/devpulse-ai.git
cd devpulse-ai

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd backend && npm install && cd ..

# 4. Set up environment variables
cp .env.example .env.local          # frontend
cp backend/.env.example backend/.env  # backend
# Fill in all required values

# 5. Set up the database
npx prisma generate
npx prisma db push

# 6. Start the development servers

# Terminal 1 — Frontend
npm run dev                   # http://localhost:3000

# Terminal 2 — Backend
cd backend && npm run dev     # http://localhost:5000
```

---

## 🗂️ Project Structure

```
devpulse-ai/
├── app/                  # Next.js App Router (pages, layouts, API routes)
│   ├── api/              # Auth and proxy API routes
│   ├── dashboard/        # Protected recruiter dashboard
│   └── login/            # Authentication entry point
├── components/           # Reusable React components (UI, dashboard, charts)
├── lib/                  # Shared utilities (auth helpers, API clients)
├── types/                # TypeScript type definitions
├── prisma/               # Database schema and Prisma migrations
├── backend/              # Express.js backend service
│   ├── routes/           # API route definitions
│   ├── controllers/      # Request handlers
│   ├── services/         # GitHub, Gemini, scoring logic
│   ├── middleware/       # Rate limiting, validation, error handling
│   └── utils/            # Shared backend utilities
├── public/               # Static assets
├── .env.example          # Frontend env template
└── tailwind.config.ts    # Tailwind CSS configuration
```

---

## 🗺️ Roadmap

- [ ] **Analysis History** — Save and revisit past GitHub profile analyses from the dashboard
- [ ] **Side-by-side Comparison** — Compare two developer profiles for direct hiring decisions
- [ ] **AI Interview Questions** — Auto-generate personalized interview questions based on identified strengths and gaps
- [ ] **PDF Export** — Download a formatted, shareable developer intelligence report as a PDF
- [ ] **Organization Analysis** — Analyze all contributors within a GitHub organization collectively
- [ ] **Custom Scoring Weights** — Let recruiters adjust scoring criteria to match specific role requirements

---

## 👨‍💻 Author

**R.Sanjay** — B.Tech Student · Full Stack Developer · AI Enthusiast

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yourusername)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/yourprofile)

---

## 🏆 What This Project Demonstrates

| Domain | Skills |
|---|---|
| Full Stack Development | Next.js 15, Express.js, REST APIs, TypeScript |
| AI Engineering | Gemini integration, prompt design, retry/fallback systems |
| Backend Architecture | Stateless APIs, rate limiting, session management |
| Database Design | PostgreSQL schema, Prisma ORM, Supabase |
| Auth & Security | OAuth 2.0, HttpOnly cookies, server-side sessions, input validation |
| System Design | Modular services, AI abstraction layer, scalable architecture |
| Product Thinking | Recruiter-centric UX, actionable intelligence over raw data |

---

## 📄 License

Distributed under the [MIT License](./LICENSE). See `LICENSE` for details.

---

<div align="center">

**DevPulse AI** — Turning GitHub profiles into developer intelligence.

</div>
