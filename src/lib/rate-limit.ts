import { isIP } from "node:net";
import { ipKeyGenerator, MemoryStore, type Options } from "express-rate-limit";

const AI_RATE_LIMIT = 10;
const AI_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1_000;

declare global {
  // Reuse the store across Next.js hot reloads instead of resetting counters.
  var devPulseAiRateLimitStore: MemoryStore | undefined;
}

function createStore(): MemoryStore {
  const store = new MemoryStore();

  // MemoryStore only reads windowMs during initialization. The package's full
  // Options type describes its Express middleware, which this Next.js adapter
  // intentionally does not instantiate.
  store.init({ windowMs: AI_RATE_LIMIT_WINDOW_MS } as Options);
  return store;
}

const store = globalThis.devPulseAiRateLimitStore ?? createStore();
globalThis.devPulseAiRateLimitStore = store;

function normalizeIp(candidate: string | null): string | null {
  if (!candidate) return null;

  let value = candidate.trim();
  if (value.startsWith("[") && value.includes("]")) {
    value = value.slice(1, value.indexOf("]"));
  } else if (value.includes(".") && value.includes(":")) {
    value = value.slice(0, value.lastIndexOf(":"));
  }

  return isIP(value) ? value : null;
}

function getClientIp(request: Request): string {
  // Hosting proxies set these headers before forwarding to the Next.js server.
  // The first X-Forwarded-For entry is the original client in a proxy chain.
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0] ?? null;
  return (
    normalizeIp(forwardedFor) ??
    normalizeIp(request.headers.get("x-real-ip")) ??
    "unknown-client"
  );
}

export async function enforceAiRateLimit(request: Request): Promise<Response | null> {
  // ipKeyGenerator safely groups IPv6 addresses by subnet to prevent trivial
  // limit bypasses through IPv6 address rotation.
  const key = ipKeyGenerator(getClientIp(request));
  const { totalHits, resetTime } = await store.increment(key);
  const remaining = Math.max(0, AI_RATE_LIMIT - totalHits);
  const resetAt = resetTime ?? new Date(Date.now() + AI_RATE_LIMIT_WINDOW_MS);
  const resetSeconds = Math.max(0, Math.ceil((resetAt.getTime() - Date.now()) / 1_000));
  const headers = {
    "RateLimit-Limit": String(AI_RATE_LIMIT),
    "RateLimit-Remaining": String(remaining),
    "RateLimit-Reset": String(resetSeconds),
  };

  if (totalHits <= AI_RATE_LIMIT) return null;

  return Response.json(
    { success: false, message: "Too many requests. Please try again later." },
    { status: 429, headers: { ...headers, "Retry-After": String(resetSeconds) } },
  );
}
