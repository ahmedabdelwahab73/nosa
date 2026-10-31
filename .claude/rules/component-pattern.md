---
paths:
  - "frontend/src/**/*.{ts,tsx}"
---

# Component pattern: tsx · data · ux · action

Every component lives in its own kebab-case folder:

```
product-card/
├── product-card.tsx          # REQUIRED — markup + Tailwind only
├── product-card.data.ts      # optional — server-side reads for this component
├── product-card.ux.ts        # optional — client behaviour (hooks, state, handlers)
├── product-card.action.ts    # optional — Server Actions (mutations)
└── index.ts                  # REQUIRED — public exports only
```

Create only the files a component needs. No empty files, no placeholders.

**The only exception: shadcn/ui primitives** in `shared/ui/` stay flat, exactly as the CLI generates
them (`shared/ui/button.tsx`, `shared/ui/dialog.tsx`...), because the CLI manages them and they import
each other through these paths. Add them with `npm run ui:add -- <name>` (from `frontend/`) — never
`npx shadcn add` directly: the CLI rewrites `cn` imports to a third-party "cn" package and the script
points them back to `@/shared/lib/utils`. Brand them through
CSS variables and `cva` variants inside the file, never by copying them. Everything we write ourselves
(in `shared/components/` and `features/`) follows this folder pattern.

## `name.tsx` — what it looks like
- JSX + Tailwind classes. No `fetch`, no `useState`/`useEffect`, no business logic, no inline handlers longer than one call.
- Server Component by default. It may be `async` and `await` its own `name.data.ts`.
- If it imports `name.ux.ts` it must start with `"use client"` — keep such components small leaves.
- Receives already-translated strings (see i18n rule) and typed view models.

## `name.data.ts` — where data comes from (server only)
- Starts with `import "server-only"`.
- Calls endpoint wrappers from `features/<domain>/api/<domain>.api.ts` (never `fetch` directly; wrappers use `shared/lib/api/http.ts`).
- Public data is cached: `"use cache"` + `cacheLife(...)` + `cacheTag(CACHE_TAGS.x)` from `@nosa/contracts`.
- Maps API DTOs to exactly what the tsx renders (localised strings picked, prices formatted).
- Never reads cookies inside a `"use cache"` function — pass the token/user id in as an argument.

## `name.ux.ts` — how it behaves (client only)
- Starts with `"use client"`. Exports one hook `useName(...)` returning everything the tsx needs.
- Holds state, effects, event handlers, animations, `useActionState`/`useOptimistic` wiring.
- No JSX, no fetching data for rendering (data arrives as props from a Server parent).

## `name.action.ts` — what it changes (server)
- Starts with `"use server"`. One exported async function per mutation.
- Validates input with zod (schemas from `@nosa/contracts` when shared with the backend).
- Calls the domain api wrapper, then `updateTag(...)` (read-your-own-writes) or `revalidateTag(tag, { expire: 0 })`.
- Returns a typed `ActionState` (`{ ok: true, data } | { ok: false, error, fieldErrors? }`) — never throws to the client for expected errors.
- Always re-checks auth/role on the server; never trust the client.

## Splitting server and client
A big component stays a Server Component and renders small client leaves inside it:

```tsx
// product-card.tsx (server)
<article>
  <ProductImage ... />          {/* server */}
  <AddToCartButton productId /> {/* client leaf: add-to-cart-button.tsx + .ux.ts + .action.ts */}
</article>
```

## index.ts
Re-export only what other folders may use: `export { ProductCard } from "./product-card";`
Import components through their folder (`@/features/catalog/components/product-card`), never deep files.
