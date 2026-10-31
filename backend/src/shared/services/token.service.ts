import { createHash, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_TTL_SECONDS, USER_ROLES, type UserRole } from "@nosa/contracts";
import { env } from "@/config/env";

export type AccessPayload = { sub: string; role: UserRole };

export function signAccessToken(payload: AccessPayload) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_TTL_SECONDS });
}

/** Returns null for any invalid/expired token instead of throwing. */
export function verifyAccessToken(token: string): AccessPayload | null {
  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
    if (typeof decoded !== "object" || typeof decoded.sub !== "string") return null;
    if (!USER_ROLES.includes(decoded.role)) return null;
    return { sub: decoded.sub, role: decoded.role };
  } catch {
    return null;
  }
}

/** Opaque random tokens (refresh, password reset); only their hash is stored. */
export const createOpaqueToken = () => randomBytes(32).toString("base64url");
export const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");
