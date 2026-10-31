import { Router } from "express";
import { homeSectionInputSchema, pageInputSchema } from "@nosa/contracts";
import { z } from "zod";
import { idParamsSchema, objectIdSchema, slugParamsSchema } from "@/shared/http/params";
import { requireRole } from "@/shared/middlewares/auth";
import { validate } from "@/shared/middlewares/validate";
import * as controller from "./cms.controller";

export const cmsRoutes = Router();
cmsRoutes.get("/home", controller.home);
cmsRoutes.get("/pages/:slug", validate({ params: slugParamsSchema }), controller.page);

export const cmsDashboardRoutes = Router();
const editors = requireRole("editor", "admin", "owner");

cmsDashboardRoutes.get("/home", controller.allSections);
cmsDashboardRoutes.post("/home", editors, validate({ body: homeSectionInputSchema }), controller.createSection);
cmsDashboardRoutes.put("/home/reorder", editors, validate({ body: z.object({ ids: z.array(objectIdSchema).min(1).max(50) }) }), controller.reorderSections);
cmsDashboardRoutes.put("/home/:id", editors, validate({ params: idParamsSchema, body: homeSectionInputSchema }), controller.updateSection);
cmsDashboardRoutes.delete("/home/:id", editors, validate({ params: idParamsSchema }), controller.deleteSection);

cmsDashboardRoutes.get("/pages", controller.pages);
cmsDashboardRoutes.put("/pages", editors, validate({ body: pageInputSchema }), controller.savePage);
cmsDashboardRoutes.delete("/pages/:slug", editors, validate({ params: slugParamsSchema }), controller.deletePage);
