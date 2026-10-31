import { Router } from "express";
import { mediaSignSchema } from "@nosa/contracts";
import { requireAuth } from "@/shared/middlewares/auth";
import { rateLimit } from "@/shared/middlewares/rate-limit";
import { validate } from "@/shared/middlewares/validate";
import * as controller from "./media.controller";

export const mediaRoutes = Router();

mediaRoutes.post(
  "/sign",
  requireAuth,
  rateLimit({ name: "media-sign", max: 60, windowSeconds: 60 * 10 }),
  validate({ body: mediaSignSchema }),
  controller.sign,
);
