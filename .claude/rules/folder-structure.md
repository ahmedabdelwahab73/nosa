# Folder ownership

Each folder holds only what belongs to it.

## Repo
- `packages/contracts/` — anything BOTH frontend and backend must agree on: enums (roles, order
  statuses, payment methods), locales, `LocalizedText`, API envelope types, `CACHE_TAGS`, shared zod
  input schemas. No runtime code that depends on Node, React or Express.
- `backend/` — Express API. `frontend/` — Next.js. They never import from each other.

## Frontend import direction
```
app/  →  features/  →  shared/
```
- `app/` routes compose features; no logic, no fetch, no Tailwind-heavy markup beyond page layout.
- `features/<a>` must not import from `features/<b>`. If two features need it, move it to `shared/`.
- `shared/` never imports from `features/` or `app/`.
- `shared/ui/` = shadcn/ui primitives only, flat files managed by the shadcn CLI
  (aliases in `frontend/components.json` point to `@/shared/ui`, `@/shared/lib/utils/cn`, `@/shared/hooks`).
  Nothing else goes there.
- `shared/components/` = our own composites reused across features (logo, price, rating,
  locale-switcher, data-table, image-uploader...), built on top of `shared/ui`.
- Store and dashboard components of the same domain live in the same feature
  (`features/catalog/components/` vs `features/catalog/dashboard/`) and share `features/catalog/api/`.

## Backend import direction
```
routes → controller → service → model
```
- Modules may call other modules' **services**, never their models directly.
- Cross-cutting code lives in `src/shared/`; config only in `src/config/`.
