import type { RequestHandler } from "express";
import { sendSuccess } from "@/shared/http/api-response";
import { currentUser } from "@/shared/middlewares/auth";
import * as service from "./wishlist.service";

export const get: RequestHandler = async (_req, res) => {
  sendSuccess(res, await service.getWishlist(currentUser(res.locals).id));
};

export const toggle: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.toggleWishlist(currentUser(res.locals).id, req.body.productId));
};
