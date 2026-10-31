import type { RequestHandler } from "express";
import { sendSuccess } from "@/shared/http/api-response";
import { currentUser } from "@/shared/middlewares/auth";
import * as service from "./cms.service";

export const home: RequestHandler = async (_req, res) => {
  sendSuccess(res, await service.listHomeSections());
};

export const page: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.getPublishedPage(String(req.params.slug)));
};

export const allSections: RequestHandler = async (_req, res) => {
  sendSuccess(res, await service.listHomeSections({ includeInactive: true }));
};

export const createSection: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.createHomeSection(req.body, currentUser(res.locals).id), 201);
};

export const updateSection: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.updateHomeSection(String(req.params.id), req.body, currentUser(res.locals).id));
};

export const deleteSection: RequestHandler = async (req, res) => {
  await service.deleteHomeSection(String(req.params.id));
  sendSuccess(res, { ok: true });
};

export const reorderSections: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.reorderHomeSections(req.body.ids));
};

export const pages: RequestHandler = async (_req, res) => {
  sendSuccess(res, await service.listPages());
};

export const savePage: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.upsertPage(req.body));
};

export const deletePage: RequestHandler = async (req, res) => {
  await service.deletePage(String(req.params.slug));
  sendSuccess(res, { ok: true });
};
