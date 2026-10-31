import type { RequestHandler } from "express";
import { sendSuccess } from "@/shared/http/api-response";
import * as service from "./coupons.service";

export const list: RequestHandler = async (_req, res) => {
  sendSuccess(res, await service.listCoupons());
};

export const create: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.createCoupon(req.body), 201);
};

export const update: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.updateCoupon(String(req.params.id), req.body));
};

export const remove: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.deleteCoupon(String(req.params.id)));
};
