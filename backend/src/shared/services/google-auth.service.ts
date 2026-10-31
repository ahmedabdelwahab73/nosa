import { OAuth2Client } from "google-auth-library";
import { env } from "@/config/env";
import { ApiError } from "@/shared/http/api-error";

let client: OAuth2Client | null = null;

export type GoogleProfile = { googleId: string; email?: string; name: string; avatar?: string };

/** Verifies a Google Identity Services ID token (One Tap / button) and returns the profile. */
export async function verifyGoogleIdToken(idToken: string): Promise<GoogleProfile> {
  if (!env.GOOGLE_CLIENT_ID) throw ApiError.notConfigured("Google sign-in");
  client ??= new OAuth2Client(env.GOOGLE_CLIENT_ID);

  const ticket = await client
    .verifyIdToken({ idToken, audience: env.GOOGLE_CLIENT_ID })
    .catch(() => {
      throw ApiError.unauthorized("Invalid Google token");
    });
  const payload = ticket.getPayload();
  if (!payload?.sub) throw ApiError.unauthorized("Invalid Google token");

  return {
    googleId: payload.sub,
    email: payload.email_verified ? payload.email : undefined,
    name: payload.name ?? payload.given_name ?? "Nosa customer",
    avatar: payload.picture,
  };
}
