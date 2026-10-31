import type { RequestHandler } from "express";
import { sendSuccess } from "@/shared/http/api-response";
import * as service from "./categories.service";

export const tree: RequestHandler = async (_req, res) => {
  sendSuccess(res, await service.getCategoryTree());
};

export const bySlug: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.getCategoryBySlug(String(req.params.slug)));
};

export const listAll: RequestHandler = async (_req, res) => {
  sendSuccess(res, await service.listCategories({ includeInactive: true }));
};

export const create: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.createCategory(req.body), 201);
};

export const update: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.updateCategory(String(req.params.id), req.body));
};

export const remove: RequestHandler = async (req, res) => {
  await service.deleteCategory(String(req.params.id));
  sendSuccess(res, { ok: true });
};

export const reorder: RequestHandler = async (req, res) => {
  await service.reorderCategories(req.body.ids);
  sendSuccess(res, { ok: true });
};
