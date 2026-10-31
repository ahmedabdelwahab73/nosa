import { Router } from "express";
import { slugParamsSchema } from "@/shared/http/params";
import { validate } from "@/shared/middlewares/validate";
import * as controller from "./categories.controller";

export const categoriesRoutes = Router();

categoriesRoutes.get("/", controller.tree);
categoriesRoutes.get("/:slug", validate({ params: slugParamsSchema }), controller.bySlug);
