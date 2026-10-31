import { Router } from "express";
import { z } from "zod";
import { requireRole } from "@/shared/middlewares/auth";
import { validate } from "@/shared/middlewares/validate";
import * as controller from "./analytics.controller";

export const analyticsDashboardRoutes = Router();

analyticsDashboardRoutes.get(
  "/overview",
  requireRole("admin", "owner"),
  validate({ query: z.object({ days: z.coerce.number().int().min(1).max(365).default(30) }) }),
  controller.overview,
);
