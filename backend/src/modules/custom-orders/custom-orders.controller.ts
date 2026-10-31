import type { RequestHandler } from "express";
import type { CustomOrderStatus } from "@nosa/contracts";
import { sendSuccess } from "@/shared/http/api-response";
import type { PaginationQuery } from "@/shared/http/pagination";
import { currentUser } from "@/shared/middlewares/auth";
import * as service from "./custom-orders.service";

export const create: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.createCustomOrder(res.locals.user?.id, req.body), 201);
};

export const mine: RequestHandler = async (_req, res) => {
  sendSuccess(res, await service.listMyCustomOrders(currentUser(res.locals).id));
};

export const respond: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.respondToQuote(currentUser(res.locals).id, String(req.params.number), req.body.accept));
};

export const list: RequestHandler = async (_req, res) => {
  const { status, ...page } = res.locals.query as PaginationQuery & { status?: CustomOrderStatus };
  const { items, meta } = await service.listCustomOrders(status, page);
  sendSuccess(res, items, 200, meta);
};

export const detail: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.getCustomOrder(String(req.params.id)));
};

export const quote: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.sendQuote(String(req.params.id), req.body));
};

export const updateStatus: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.updateCustomOrderStatus(String(req.params.id), req.body.status, req.body.note));
};
