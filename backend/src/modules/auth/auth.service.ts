import { randomUUID } from "node:crypto";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  DEFAULT_LOCALE,
  REFRESH_TOKEN_TTL_DAYS,
  type AuthResult,
  type LoginInput,
  type RegisterInput,
} from "@nosa/contracts";
import { env } from "@/config/env";
import { ApiError } from "@/shared/http/api-error";
import { verifyGoogleIdToken } from "@/shared/services/google-auth.service";
import { hashPassword, verifyPassword } from "@/shared/services/password.service";
import { createOpaqueToken, hashToken, signAccessToken } from "@/shared/services/token.service";
import { UserModel, type UserDocument } from "@/modules/users/users.model";
import { toSessionUser } from "@/modules/users/users.service";
import { AuthTokenModel } from "./auth-token.model";

const DAY_MS = 24 * 60 * 60 * 1000;
const RESET_TTL_MS = 60 * 60 * 1000;

async function issueTokens(user: UserDocument, family: string = randomUUID()): Promise<AuthResult> {
  const refreshToken = createOpaqueToken();
  await AuthTokenModel.create({
    user: user._id,
    type: "refresh",
    tokenHash: hashToken(refreshToken),
    family,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * DAY_MS),
  });
  user.lastLoginAt = new Date();
  await user.save();

  return {
    user: toSessionUser(user),
    tokens: {
      accessToken: signAccessToken({ sub: user.id, role: user.role }),
      refreshToken,
      expiresIn: ACCESS_TOKEN_TTL_SECONDS,
    },
  };
}

function assertActive(user: UserDocument) {
  if (!user.isActive) throw ApiError.forbidden("This account is disabled");
}

/** Step 1 of the phone-first flow: does this number already have an account? */
export async function checkPhone(phone: string) {
  return { exists: Boolean(await UserModel.exists({ phone })) };
}

export async function register(input: RegisterInput) {
  if (await UserModel.exists({ phone: input.phone })) {
    throw new ApiError("CONFLICT", "Phone already registered", { "body.phone": ["ALREADY_EXISTS"] });
  }
  const user = await UserModel.create({
    name: input.name,
    phone: input.phone,
    passwordHash: await hashPassword(input.password),
    providers: ["phone"],
  });
  return issueTokens(user);
}

export async function login({ phone, password }: LoginInput) {
  const user = await UserModel.findOne({ phone }).select("+passwordHash");
  // Same error for unknown phone and wrong password.
  if (!user?.passwordHash || !(await verifyPassword(user.passwordHash, password))) {
    throw ApiError.unauthorized("Wrong phone or password");
  }
  assertActive(user);
  return issueTokens(user);
}

/** Google One Tap / button: find by Google id, else link by verified email, else create. */
export async function loginWithGoogle(idToken: string) {
  const profile = await verifyGoogleIdToken(idToken);

  let user =
    (await UserModel.findOne({ googleId: profile.googleId })) ??
    (profile.email ? await UserModel.findOne({ email: profile.email }) : null);

  if (user) {
    user.googleId ??= profile.googleId;
    user.avatar ??= profile.avatar;
    if (!user.providers.includes("google")) user.providers.push("google");
  } else {
    user = new UserModel({
      name: profile.name,
      email: profile.email,
      googleId: profile.googleId,
      avatar: profile.avatar,
      providers: ["google"],
    });
  }
  assertActive(user);
  return issueTokens(user);
}

/** Rotates the refresh token. Reusing an old token revokes the whole login (family). */
export async function refresh(refreshToken: string) {
  const stored = await AuthTokenModel.findOne({ tokenHash: hashToken(refreshToken), type: "refresh" });
  if (!stored || stored.expiresAt < new Date()) throw ApiError.unauthorized("Session expired");

  if (stored.usedAt) {
    await AuthTokenModel.deleteMany({ family: stored.family });
    throw ApiError.unauthorized("Session revoked");
  }

  stored.usedAt = new Date();
  await stored.save();

  const user = await UserModel.findById(stored.user);
  if (!user) throw ApiError.unauthorized("Session expired");
  assertActive(user);
  return issueTokens(user, stored.family);
}

export async function logout(refreshToken: string) {
  const stored = await AuthTokenModel.findOne({ tokenHash: hashToken(refreshToken) });
  if (stored) await AuthTokenModel.deleteMany({ family: stored.family });
}

/**
 * Free "forgot password": staff generate a one-time link and send it to the customer on WhatsApp.
 * Valid for one hour.
 */
export async function createResetLink(userId: string) {
  const user = await UserModel.findById(userId);
  if (!user) throw ApiError.notFound("User");

  await AuthTokenModel.deleteMany({ user: user._id, type: "reset" });
  const token = createOpaqueToken();
  await AuthTokenModel.create({
    user: user._id,
    type: "reset",
    tokenHash: hashToken(token),
    family: randomUUID(),
    expiresAt: new Date(Date.now() + RESET_TTL_MS),
  });

  return {
    url: `${env.FRONTEND_URL}/${DEFAULT_LOCALE}/reset-password?token=${token}`,
    expiresAt: new Date(Date.now() + RESET_TTL_MS).toISOString(),
  };
}

export async function resetPassword(token: string, password: string) {
  const stored = await AuthTokenModel.findOneAndDelete({ tokenHash: hashToken(token), type: "reset" });
  if (!stored || stored.expiresAt < new Date()) throw ApiError.unauthorized("Reset link expired");

  const user = await UserModel.findById(stored.user);
  if (!user) throw ApiError.notFound("User");

  user.passwordHash = await hashPassword(password);
  if (!user.providers.includes("phone")) user.providers.push("phone");
  await user.save();

  // Sign out everywhere after a password change.
  await AuthTokenModel.deleteMany({ user: user._id, type: "refresh" });
  return { ok: true };
}

/** Signed-in user changes their own password: other devices are signed out and a fresh session is returned. */
export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await UserModel.findById(userId).select("+passwordHash");
  if (!user) throw ApiError.notFound("User");
  assertActive(user);
  if (!user.passwordHash || !(await verifyPassword(user.passwordHash, currentPassword))) {
    throw new ApiError("VALIDATION_ERROR", "Current password is wrong", { "body.currentPassword": ["WRONG_PASSWORD"] });
  }
  user.passwordHash = await hashPassword(newPassword);
  user.mustChangePassword = false;
  if (!user.providers.includes("phone")) user.providers.push("phone");
  await user.save();
  await AuthTokenModel.deleteMany({ user: user._id, type: "refresh" });
  return issueTokens(user);
}

/** Signs a user out everywhere (used when an admin disables them or sets a new password). */
export async function revokeSessions(userId: string) {
  await AuthTokenModel.deleteMany({ user: userId, type: "refresh" });
}
