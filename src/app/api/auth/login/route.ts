import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

export function GET() {
  const state = randomBytes(32).toString("hex");
  const authorizationUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  authorizationUrl.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID ?? "");
  authorizationUrl.searchParams.set("redirect_uri", process.env.GOOGLE_REDIRECT_URI ?? "");
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("scope", "openid email profile");
  authorizationUrl.searchParams.set("access_type", "offline");
  authorizationUrl.searchParams.set("prompt", "consent");
  authorizationUrl.searchParams.set("state", state);

  return NextResponse.redirect(authorizationUrl);
}
