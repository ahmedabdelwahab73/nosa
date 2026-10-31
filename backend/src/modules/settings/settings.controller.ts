import type { RequestHandler } from "express";
import { sendSuccess } from "@/shared/http/api-response";
import * as service from "./settings.service";

export const publicSettings: RequestHandler = async (_req, res) => {
  sendSuccess(res, await service.getPublicSettings());
};

export const fullSettings: RequestHandler = async (_req, res) => {
  sendSuccess(res, await service.getSettings());
};

export const update: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.updateSettings(req.body));
};
