import type { RequestHandler } from "express";
import { sendSuccess } from "@/shared/http/api-response";
import { currentUser } from "@/shared/middlewares/auth";
import { getSessionUser } from "@/modules/users/users.service";
import * as authService from "./auth.service";

export const checkPhone: RequestHandler = async (req, res) => {
  sendSuccess(res, await authService.checkPhone(req.body.phone));
};

export const register: RequestHandler = async (req, res) => {
  sendSuccess(res, await authService.register(req.body), 201);
};

export const login: RequestHandler = async (req, res) => {
  sendSuccess(res, await authService.login(req.body));
};

export const google: RequestHandler = async (req, res) => {
  sendSuccess(res, await authService.loginWithGoogle(req.body.idToken));
};

export const refresh: RequestHandler = async (req, res) => {
  sendSuccess(res, await authService.refresh(req.body.refreshToken));
};

export const logout: RequestHandler = async (req, res) => {
  await authService.logout(req.body.refreshToken);
  sendSuccess(res, { ok: true });
};

export const resetPassword: RequestHandler = async (req, res) => {
  sendSuccess(res, await authService.resetPassword(req.body.token, req.body.password));
};

export const me: RequestHandler = async (_req, res) => {
  sendSuccess(res, await getSessionUser(currentUser(res.locals).id));
};

export const changePassword: RequestHandler = async (req, res) => {
  sendSuccess(res, await authService.changePassword(currentUser(res.locals).id, req.body.currentPassword, req.body.newPassword));
};
