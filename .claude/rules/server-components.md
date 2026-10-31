---
paths:
  - "frontend/**"
---

# SSR & Server Components (Next.js 16, Cache Components on)

## Default: server
- Pages, layouts and components are Server Components. Add `"use client"` only for a leaf that needs
  state, effects, browser APIs or event handlers — and keep that leaf as small as possible.
- Never fetch data in Client Components (no `useEffect` fetching, no client SWR for page data).
  Server parents fetch and pass props.
- Client Components cannot import `server-only` modules, `next/root-params`, or `*.data.ts` files.

## Caching model
| Data | How |
|---|---|
| Public catalog, CMS, stories, settings | `"use cache"` + `cacheLife("hours"|"days")` + `cacheTag(CACHE_TAGS.*)` |
| Per-user (cart, account, orders) | Read at request time inside `<Suspense>`; pass ids/tokens into cached functions if needed |
| Dashboard | Request-time reads inside `<Suspense>`; no shared cache |

- Every `"use cache"` gets a `cacheLife` and at least one `cacheTag`. Tags come from `CACHE_TAGS` in
  `@nosa/contracts` — the same constants the backend sends to `/api/revalidate`.
- Runtime APIs (`cookies()`, `headers()`, `searchParams`, `connection()`) must sit inside a `<Suspense>`
  boundary. Never `await` the session at the top level of a layout — push it down into a component.
- `Date.now()`, `Math.random()`, `crypto.randomUUID()` need `await connection()` first or a cached scope.

## Mutations
- Server Actions (`*.action.ts`) for every write. After a write: `updateTag()` for the user's own view,
  `revalidateTag(tag, { expire: 0 })` for external writes (Express), so the next visit is fresh.
- When data changes in the backend (dashboard, cron jobs), the Express service calls
  `revalidateFrontend([...tags])` → `POST /api/revalidate`.

## Routing & SEO
- `page.tsx` is thin: read params, compose feature components, export `generateMetadata`.
- Product and category pages: `generateStaticParams` for top items, JSON-LD (Product, BreadcrumbList).
- `loading.tsx` / `<Suspense>` fallbacks use `shared/ui/skeleton`.
- `error.tsx` + `not-found.tsx` per route group.
- Images: always `next/image` with explicit `sizes`; LCP image gets `priority`.

## Auth (when built)
- Session cookie is httpOnly, set only by Server Actions. A `getSession()` DAL in `shared/lib/auth`
  reads it; `requireRole()` guards dashboard pages and actions. `proxy.ts` does optimistic redirects only.
