import "server-only";
import type { AuthResult, SessionUser } from "@nosa/contracts";
import { http } from "@/shared/lib/api/http";

/** One function per backend auth endpoint. */
export const authApi = {
  checkPhone: (phone: string) =>
    http<{ exists: boolean }>("/auth/phone/check", { method: "POST", body: { phone } }),

  register: (input: { name: string; phone: string; password: string }) =>
    http<AuthResult>("/auth/register", { method: "POST", body: input }),

  login: (input: { phone: string; password: string }) =>
    http<AuthResult>("/auth/login", { method: "POST", body: input }),

  google: (idToken: string) => http<AuthResult>("/auth/google", { method: "POST", body: { idToken } }),

  refresh: (refreshToken: string) =>
    http<AuthResult>("/auth/refresh", { method: "POST", body: { refreshToken } }),

  logout: (refreshToken: string) => http<{ ok: true }>("/auth/logout", { method: "POST", body: { refreshToken } }),

  resetPassword: (token: string, password: string) =>
    http<{ ok: true }>("/auth/reset-password", { method: "POST", body: { token, password } }),

  changePassword: (token: string, input: { currentPassword: string; newPassword: string }) =>
    http<AuthResult>("/auth/change-password", { method: "POST", token, body: input }),

  me: (token: string) => http<SessionUser>("/auth/me", { token }),
};
