# Error handling

Expected errors are values; unexpected errors are logged and shown as a friendly message.
A failure in one part of a page never breaks the whole page.

## Backend (Express)
- Services throw `ApiError` only. Anything else becomes `INTERNAL_ERROR` in the error handler.
- The error handler also maps:
  - Mongo duplicate key `11000` → `CONFLICT`, with the field
  - `CastError` → `NOT_FOUND`
  - zod errors → `VALIDATION_ERROR` with `details`
- Production responses never include stack traces or internal messages.
- Every request has an `x-request-id` (sent by Next.js or generated) that appears in logs and error
  responses.
- Every external call (Cloudinary, Meta, Google, mail, revalidation) has a timeout
  (`AbortSignal.timeout`) and its own error handling. Failures of non-critical side effects (email,
  revalidation) are logged and never fail the main request.
- Checkout is idempotent: the client sends an `idempotency-key` per checkout attempt, so double
  clicks or retries never create two orders. Stock is decremented with conditional atomic updates and
  restored if the order fails.

## Frontend (Next.js)
- `http()` throws `HttpError` (status, code, details).
- `*.data.ts`: `NOT_FOUND` → `notFound()`. Other errors bubble to the nearest error boundary.
- `*.action.ts` never throws expected errors. It returns
  `{ ok: false, code, message, fieldErrors? }` with a translated message. Unexpected errors are caught,
  logged with the request id, and returned as a generic message.
- Messages: every `ApiErrorCode` has a translation under `errors.<CODE>` in both dictionaries.
- UI:
  - field errors inline under the input
  - action results as toasts (sonner)
  - zero results = empty state, not an error
- Boundaries:
  - `error.tsx` + `not-found.tsx` per route group (store, account, dashboard), with a retry button,
    a bilingual message and the request id
  - `global-error.tsx` at the root
- Independent sections (stories rail, reviews, related products, dashboard widgets) each get their
  own error boundary, so if one fails the rest of the page still renders.

## Monitoring (free)
Sentry Developer plan for frontend + backend (same request id), plus Vercel logs. Never log
passwords, tokens or full phone numbers.
