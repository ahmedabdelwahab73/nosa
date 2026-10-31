import { Router } from "express";
import { settingsInputSchema } from "@nosa/contracts";
import { requireRole } from "@/shared/middlewares/auth";
import { validate } from "@/shared/middlewares/validate";
import * as controller from "./settings.controller";

export const settingsRoutes = Router();
settingsRoutes.get("/", controller.publicSettings);

export const settingsDashboardRoutes = Router();
settingsDashboardRoutes.get("/", controller.fullSettings);
settingsDashboardRoutes.put("/", requireRole("admin", "owner"), validate({ body: settingsInputSchema }), controller.update);
