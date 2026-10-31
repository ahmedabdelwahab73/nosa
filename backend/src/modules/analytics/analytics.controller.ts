import type { RequestHandler } from "express";
import { sendSuccess } from "@/shared/http/api-response";
import * as service from "./analytics.service";

export const overview: RequestHandler = async (_req, res) => {
  const { days } = res.locals.query as { days: number };
  sendSuccess(res, await service.getOverview(days));
};
