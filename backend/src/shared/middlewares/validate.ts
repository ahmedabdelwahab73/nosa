import type { RequestHandler } from "express";
import { z, type ZodType } from "zod";
import { ApiError } from "@/shared/http/api-error";

type Schemas = { body?: ZodType; query?: ZodType; params?: ZodType };

/**
 * Validates and replaces req.body / req.query / req.params with the parsed values.
 * Parsed query lives on res.locals.query because Express 5 makes req.query read-only.
 */
export const validate =
  (schemas: Schemas): RequestHandler =>
  (req, res, next) => {
    const errors: Record<string, string[]> = {};

    for (const part of ["body", "query", "params"] as const) {
      const schema = schemas[part];
      if (!schema) continue;

      const result = schema.safeParse(req[part]);
      if (!result.success) {
        for (const [field, messages] of Object.entries(z.flattenError(result.error).fieldErrors)) {
          errors[`${part}.${field}`] = messages as string[];
        }
        continue;
      }

      if (part === "query") res.locals.query = result.data;
      else req[part] = result.data;
    }

    if (Object.keys(errors).length) {
      return next(new ApiError("VALIDATION_ERROR", "Invalid request", errors));
    }
    next();
  };
