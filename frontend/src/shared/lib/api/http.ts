import "server-only";
import { API_PREFIX, type ApiErrorCode, type ApiResponse, type PaginationMeta } from "@nosa/contracts";
import { serverEnv } from "@/shared/config/env.server";

export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: ApiErrorCode,
    message: string,
    readonly details?: Record<string, string[]>,
  ) {
    super(message);
  }
}

type Query = Record<string, string | number | boolean | undefined>;

type HttpOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  query?: Query;
  /** Passed in explicitly by the session layer, so cached reads never touch cookies. */
  token?: string;
};

/**
 * The only way the frontend talks to the Express API.
 * Every *.data.ts and *.action.ts file goes through here — never call fetch directly.
 */
export async function http<T>(path: string, options: HttpOptions = {}) {
  const { body, query, token, headers, ...init } = options;

  const url = new URL(`${API_PREFIX}${path}`, serverEnv.API_URL);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  const res = await fetch(url, {
    ...init,
    headers: {
      accept: "application/json",
      ...(body !== undefined && { "content-type": "application/json" }),
      ...(token && { authorization: `Bearer ${token}` }),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const json = (await res.json()) as ApiResponse<T>;
  if (!json.success) {
    throw new HttpError(res.status, json.error.code, json.error.message, json.error.details);
  }
  return { data: json.data, meta: json.meta as PaginationMeta | undefined };
}
