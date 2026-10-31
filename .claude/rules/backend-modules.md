---
paths:
  - "backend/**"
---

# Backend module pattern

```
src/modules/products/
├── products.model.ts            # Mongoose schema + model + inferred document type
├── products.validation.ts       # zod schemas for body / query / params
├── products.service.ts          # ALL business logic + DB access
├── products.controller.ts       # thin: req → service → sendSuccess
├── products.routes.ts           # public/customer router
└── products.dashboard.routes.ts # staff router (optional), mounted under /dashboard
```

## Responsibilities
- **model** — schema only. Reuse shared sub-schemas (`localizedTextSchema`, image schema) from
  `src/shared/db`. Indexes declared here (slug unique, text index for search).
- **validation** — zod; import enums/shared schemas from `@nosa/contracts`. Used via `validate({ body, query, params })`.
- **service** — the only layer that touches models. Throws `ApiError`. After writes that affect the
  storefront, calls `revalidateFrontend([CACHE_TAGS....])`. Returns `doc.toJSON()` objects — `.lean()` skips the global
  id plugin, so lean results must be mapped to `id` explicitly before leaving the service.
- **controller** — no logic, no try/catch (Express 5 forwards rejections). Reads validated input,
  calls one service function, responds with `sendSuccess(res, data, status?, meta?)`.
- **routes** — wiring only: `router.get("/", validate({ query }), controller.list)`, auth guards.

## Rules
- Register each router once in `src/routes.ts`; dashboard routers under `/dashboard/<name>` behind
  `requireRole(...DASHBOARD_ROLES)`.
- Never return Mongoose documents with internals; the global plugin gives `id` and hides `__v`.
- Money is EGP stored as `Number` with at most 2 decimals, validated by zod.
- Long work (image background removal, Instagram sync, emails) runs in `src/jobs` or async after the
  response — never blocks a request longer than needed.
- Secrets and config only via `env` from `src/config/env.ts`.
