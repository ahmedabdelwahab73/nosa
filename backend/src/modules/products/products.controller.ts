import type { RequestHandler } from "express";
import type { ProductListQuery } from "@nosa/contracts";
import { sendSuccess } from "@/shared/http/api-response";
import * as service from "./products.service";

export const list: RequestHandler = async (_req, res) => {
  const { items, meta } = await service.listProducts(res.locals.query as ProductListQuery);
  sendSuccess(res, items, 200, meta);
};

export const bySlug: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.getPublishedProduct(String(req.params.slug)));
};

export const related: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.listRelatedProducts(String(req.params.slug)));
};

export const dashboardList: RequestHandler = async (_req, res) => {
  const { items, meta } = await service.listProductsForDashboard(
    res.locals.query as Parameters<typeof service.listProductsForDashboard>[0],
  );
  sendSuccess(res, items, 200, meta);
};

export const byId: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.getProductById(String(req.params.id)));
};

export const create: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.createProduct(req.body), 201);
};

export const update: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.updateProduct(String(req.params.id), req.body));
};

export const duplicate: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.duplicateProduct(String(req.params.id)), 201);
};

export const bulkStatus: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.setProductsStatus(req.body.ids, req.body.status));
};

export const remove: RequestHandler = async (req, res) => {
  await service.deleteProduct(String(req.params.id));
  sendSuccess(res, { ok: true });
};

export const facets: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.getProductFacets(typeof req.query.category === "string" ? req.query.category : undefined));
};
