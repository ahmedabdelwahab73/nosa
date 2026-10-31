import { Router } from "express";
import { productListQuerySchema } from "@nosa/contracts";
import { slugParamsSchema } from "@/shared/http/params";
import { validate } from "@/shared/middlewares/validate";
import * as controller from "./products.controller";

export const productsRoutes = Router();

productsRoutes.get("/", validate({ query: productListQuerySchema }), controller.list);
productsRoutes.get("/facets", controller.facets);
productsRoutes.get("/:slug", validate({ params: slugParamsSchema }), controller.bySlug);
productsRoutes.get("/:slug/related", validate({ params: slugParamsSchema }), controller.related);
