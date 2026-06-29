import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE_NAME = "session_token";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function getCookieValue(cookieHeader: string | null, name: string): string | undefined {
  if (!cookieHeader) {
    return undefined;
  }

  return cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

export async function isValidSessionToken(sessionToken: string | undefined): Promise<boolean> {
  if (!sessionToken || !UUID_PATTERN.test(sessionToken)) {
    return false;
  }

  const session = await prisma.session.findUnique({
    where: { token: sessionToken },
    select: { expiresAt: true },
  });

  return Boolean(session && session.expiresAt > new Date());
}

export async function hasValidSessionFromCookieHeader(cookieHeader: string | null): Promise<boolean> {
  return isValidSessionToken(getCookieValue(cookieHeader, SESSION_COOKIE_NAME));
}
