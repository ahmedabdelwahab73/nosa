import type { RequestHandler, Response } from "express";
import { CART_ID_HEADER } from "@nosa/contracts";
import { ApiError } from "@/shared/http/api-error";
import { sendSuccess } from "@/shared/http/api-response";
import { currentUser } from "@/shared/middlewares/auth";
import * as service from "./cart.service";

const GUEST_ID = /^[\w-]{16,64}$/;

/** Signed-in users own their cart; guests send the id Next.js keeps in a cookie. */
function owner(req: Parameters<RequestHandler>[0], res: Response): service.CartOwner {
  const guestId = req.header(CART_ID_HEADER);
  return {
    userId: res.locals.user?.id,
    guestId: guestId && GUEST_ID.test(guestId) ? guestId : undefined,
  };
}

export const get: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.getCart(owner(req, res)));
};

export const addItem: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.addItem(owner(req, res), req.body));
};

export const updateItem: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.updateItem(owner(req, res), String(req.params.id), req.body.quantity));
};

export const removeItem: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.removeItem(owner(req, res), String(req.params.id)));
};

export const applyCoupon: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.applyCoupon(owner(req, res), req.body.code));
};

export const removeCoupon: RequestHandler = async (req, res) => {
  sendSuccess(res, await service.removeCoupon(owner(req, res)));
};

export const merge: RequestHandler = async (req, res) => {
  const guestId = req.header(CART_ID_HEADER);
  if (!guestId || !GUEST_ID.test(guestId)) throw new ApiError("VALIDATION_ERROR", "Missing guest cart id");
  sendSuccess(res, await service.mergeGuestCart(currentUser(res.locals).id, guestId));
};
