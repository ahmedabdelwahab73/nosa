import { Router } from "express";
import {
  changePasswordSchema,
  googleLoginSchema,
  loginSchema,
  phoneCheckSchema,
  refreshSchema,
  registerSchema,
  resetPasswordSchema,
} from "@nosa/contracts";
import { validate } from "@/shared/middlewares/validate";
import { rateLimit } from "@/shared/middlewares/rate-limit";
import { requireAuth } from "@/shared/middlewares/auth";
import * as controller from "./auth.controller";

export const authRoutes = Router();

// Tight limits where someone could guess numbers or passwords.
const guard = rateLimit({ name: "auth", max: 10, windowSeconds: 60 });
const phoneCheckGuard = rateLimit({ name: "phone-check", max: 20, windowSeconds: 60 * 10 });

authRoutes.post("/phone/check", phoneCheckGuard, validate({ body: phoneCheckSchema }), controller.checkPhone);
authRoutes.post("/register", guard, validate({ body: registerSchema }), controller.register);
authRoutes.post("/login", guard, validate({ body: loginSchema }), controller.login);
authRoutes.post("/google", guard, validate({ body: googleLoginSchema }), controller.google);
authRoutes.post("/refresh", validate({ body: refreshSchema }), controller.refresh);
authRoutes.post("/logout", validate({ body: refreshSchema }), controller.logout);
authRoutes.post("/reset-password", guard, validate({ body: resetPasswordSchema }), controller.resetPassword);
authRoutes.post("/change-password", requireAuth, guard, validate({ body: changePasswordSchema }), controller.changePassword);
authRoutes.get("/me", requireAuth, controller.me);
