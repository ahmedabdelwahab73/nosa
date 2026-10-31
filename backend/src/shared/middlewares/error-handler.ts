import type { ErrorRequestHandler, RequestHandler } from "express";
import mongoose from "mongoose";
import type { ApiFailure } from "@nosa/contracts";
import { ApiError } from "@/shared/http/api-error";
import { logger } from "@/config/logger";
import { isProd } from "@/config/env";

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl}`));
};

/** Turns known library errors into ApiErrors so clients always get a clean code. */
function toApiError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;

  if (err instanceof mongoose.Error.CastError) return ApiError.notFound("Resource");

  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.fromEntries(
      Object.entries(err.errors).map(([field, error]) => [`body.${field}`, [error.message]]),
    );
    return new ApiError("VALIDATION_ERROR", "Invalid data", details);
  }

  if (typeof err === "object" && err && "code" in err && err.code === 11000) {
    const fields = Object.keys((err as { keyValue?: Record<string, unknown> }).keyValue ?? {});
    return new ApiError(
      "CONFLICT",
      "Already exists",
      Object.fromEntries(fields.map((field) => [`body.${field}`, ["ALREADY_EXISTS"]])),
    );
  }

  if (err instanceof SyntaxError && "body" in err) return new ApiError("VALIDATION_ERROR", "Malformed JSON");

  return new ApiError("INTERNAL_ERROR", "Something went wrong");
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const apiError = toApiError(err);
  const requestId = res.locals.requestId;

  if (apiError.status >= 500) logger.error({ err, requestId }, "Unhandled error");

  const body: ApiFailure & { requestId?: string } = {
    success: false,
    error: {
      code: apiError.code,
      message: apiError.status >= 500 && isProd ? "Something went wrong" : apiError.message,
      details: apiError.details,
    },
    requestId,
  };
  res.status(apiError.status).json(body);
};
