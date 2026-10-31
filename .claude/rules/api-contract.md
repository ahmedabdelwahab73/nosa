# API contract

- Base path: `/api/v1` (`API_PREFIX` in contracts). Dashboard endpoints: `/api/v1/dashboard/...`.
- Success: `{ "success": true, "data": T, "meta"?: { page, limit, total, pages } }` — `sendSuccess()`.
- Failure: `{ "success": false, "error": { "code", "message", "details"? } }` — throw `ApiError`.
  Codes: `VALIDATION_ERROR 422 · UNAUTHORIZED 401 · FORBIDDEN 403 · NOT_FOUND 404 · CONFLICT 409 · RATE_LIMITED 429 · INTERNAL_ERROR 500`.
- `details` maps `"body.field"` → messages, so forms can show field errors.
- Lists: `?page=1&limit=20` (max 100), plus filters and `sort`. Always return `meta`.
- Resources are identified by `slug` on the storefront and `id` in the dashboard.
- Localised fields are returned as `{ ar, en }`; the frontend picks one.
- The frontend calls the API only from the server through `shared/lib/api/http.ts`, which unwraps the
  envelope and throws `HttpError` on failure.
- Types shared by both sides go in `@nosa/contracts`; don't hand-copy DTO types.
