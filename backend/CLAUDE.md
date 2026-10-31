# Backend (Express 5 + Mongoose)

Project-wide rules live in the root `CLAUDE.md` and `.claude/rules/`. Module rules: `.claude/rules/backend-modules.md`.

## Facts

- ESM (`"type": "module"`), TypeScript, path alias `@/` → `src/`.
- Dev: `tsx watch --env-file=.env`. Build: `tsup` bundles `@nosa/contracts` into `dist/`.
- Production runs on **Vercel Functions**: `app.ts` exports the Express app for Vercel; `server.ts`
  (`listen`) is for local development only. Region `fra1`, next to the Atlas cluster (Frankfurt).
- MongoDB: local in dev, Atlas M0 in production. One cached connection reused across invocations.
- Env is validated once in `src/config/env.ts` (zod). Read config only from `env`, never `process.env` elsewhere.
- Express 5 forwards rejected promises to the error handler. No `asyncHandler` wrappers, no try/catch just to call `next(err)`.
- `req.query` is read-only in Express 5: validated query is on `res.locals.query`.
- A global Mongoose plugin (`shared/db/base-schema.plugin.ts`) maps `_id → id` and drops `__v` in JSON.
- All routes are mounted once in `src/routes.ts` under `/api/v1`.
- No files on disk: images go to Cloudinary (signed direct uploads, see `.claude/rules/media-cloudinary.md`).
- Scheduled work = protected HTTP endpoints under `/api/v1/jobs/*` (header `x-cron-secret`), called by
  cron-job.org. Vercel Hobby crons only run once a day, so they are not used for hourly jobs.
- After-response work uses `waitUntil()` from `@vercel/functions`.

## Layout

```
src/
├── server.ts            # local dev only: connect DB, listen, graceful shutdown
├── app.ts               # express app: middleware, routes, 404, error handler (exported for Vercel)
├── routes.ts            # mounts every module router
├── config/              # env, db (cached connection), logger
├── shared/
│   ├── db/              # mongoose plugins, shared sub-schemas (localized text, image, seo, address)
│   ├── http/            # ApiError, sendSuccess, pagination
│   ├── middlewares/     # validate, error-handler, request-id, auth guards, rate limit (Mongo store)
│   └── services/        # next-revalidate, cloudinary, mailer (Gmail SMTP), google-auth, crypto, counter, slug
├── modules/<name>/      # one folder per domain (see rules)
└── jobs/                # instagram-sync, meta-token-refresh, cart-cleanup (HTTP-triggered)
```
