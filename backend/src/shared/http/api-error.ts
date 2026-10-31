import type { ApiErrorCode } from "@nosa/contracts";

const STATUS_BY_CODE: Record<ApiErrorCode, number> = {
  VALIDATION_ERROR: 422,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
};

/** Throw this from any service; the error middleware turns it into an ApiFailure. */
export class ApiError extends Error {
  readonly status: number;

  constructor(
    readonly code: ApiErrorCode,
    message: string,
    readonly details?: Record<string, string[]>,
    status?: number,
  ) {
    super(message);
    this.status = status ?? STATUS_BY_CODE[code];
  }

  static notFound(resource: string) {
    return new ApiError("NOT_FOUND", `${resource} not found`);
  }

  static unauthorized(message = "Authentication required") {
    return new ApiError("UNAUTHORIZED", message);
  }

  static forbidden(message = "You are not allowed to do this") {
    return new ApiError("FORBIDDEN", message);
  }

  /** An optional integration (Google, Cloudinary...) isn't configured yet. */
  static notConfigured(feature: string) {
    return new ApiError("INTERNAL_ERROR", `${feature} is not configured`, undefined, 503);
  }
}
