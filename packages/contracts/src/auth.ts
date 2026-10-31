import { z } from "zod";
import type { UserRole } from "./enums";
import { phoneSchema } from "./phone";

export const passwordSchema = z.string().min(8, "PASSWORD_TOO_SHORT").max(128);

export const phoneCheckSchema = z.object({ phone: phoneSchema });

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: phoneSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1).max(128),
});

export const googleLoginSchema = z.object({ idToken: z.string().min(10) });

export const refreshSchema = z.object({ refreshToken: z.string().min(10) });

export const resetPasswordSchema = z.object({
  token: z.string().min(10),
  password: passwordSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

/** What the API returns about the signed-in user. */
export type SessionUser = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  avatar?: string;
  role: UserRole;
  providers: AuthProvider[];
  /** Set for accounts that got a temporary password: the dashboard asks for a new one first. */
  mustChangePassword?: boolean;
};

export type AuthProvider = "phone" | "google";

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  /** Seconds until the access token expires. */
  expiresIn: number;
};

export type AuthResult = { user: SessionUser; tokens: AuthTokens };

export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
export const REFRESH_TOKEN_TTL_DAYS = 60;
