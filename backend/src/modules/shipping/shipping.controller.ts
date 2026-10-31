import type { RequestHandler } from "express";
import { sendSuccess } from "@/shared/http/api-response";
import * as service from "./shipping.service";

export const governorates: RequestHandler = async (_req, res) => {
  sendSuccess(res, await service.listGovernorates());
};

export const allGovernorates: RequestHandler = async (_req, res) => {
  sendSuccess(res, await service.listGovernorates({ includeInactive: true }));
};

export const updateRate: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.updateGovernorateRate(String(req.params.code), req.body));
};
