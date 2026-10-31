import type { RequestHandler } from "express";
import type { UserRole } from "@nosa/contracts";
import { ApiError } from "@/shared/http/api-error";
import { verifyAccessToken } from "@/shared/services/token.service";

export type AuthUser = { id: string; role: UserRole };

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Locals {
      user?: AuthUser;
      requestId?: string;
      query?: unknown;
    }
  }
}

function readUser(header: string | undefined): AuthUser | null {
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const payload = token ? verifyAccessToken(token) : null;
  return payload ? { id: payload.sub, role: payload.role } : null;
}

/** Attaches the user when a valid token is present; never rejects. */
export const optionalAuth: RequestHandler = (req, res, next) => {
  const user = readUser(req.header("authorization"));
  if (user) res.locals.user = user;
  next();
};

export const requireAuth: RequestHandler = (req, res, next) => {
  const user = readUser(req.header("authorization"));
  if (!user) return next(ApiError.unauthorized());
  res.locals.user = user;
  next();
};

/** Use after requireAuth. */
export const requireRole =
  (...roles: readonly UserRole[]): RequestHandler =>
  (_req, res, next) => {
    const user = res.locals.user;
    if (!user) return next(ApiError.unauthorized());
    if (!roles.includes(user.role)) return next(ApiError.forbidden());
    next();
  };

/** Helper for controllers behind requireAuth. */
export function currentUser(locals: Express.Locals): AuthUser {
  if (!locals.user) throw ApiError.unauthorized();
  return locals.user;
}
