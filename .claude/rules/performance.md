# Performance: light servers, smooth site

Everything runs on free tiers (Vercel Hobby, Atlas M0, Cloudinary Free). Every change must keep server
work and client JS low.

## Light on the server
- **Public pages are prerendered.** Home, shop, category, product, stories and CMS pages must show
  as `○` or `◐` in `next build`. A public page turning into `ƒ` is a bug.
- Public reads: `"use cache"` + `cacheLife("hours" | "days")` + `cacheTag`. Freshness comes from
  revalidation by tag, never from short lifetimes. No `cacheLife("seconds")` on public data.
- No client polling, no `setInterval` fetches. Background work runs from cron endpoints.
- Images never pass through our servers (see `media-cloudinary.md`).
- MongoDB:
  - an index for every filter/sort field
  - `.select()` only the needed fields; list DTOs are smaller than detail DTOs
  - always paginate (max 100); never return unbounded lists
  - no N+1: use `$in` / a single aggregation instead of queries in loops
  - analytics aggregations are cached
- One cached Mongoose connection reused across serverless invocations, small `maxPoolSize`.
- Independent reads run in parallel (`Promise.all`).
- Side effects (emails, revalidation, Cloudinary deletes) run after the response:
  `after()` in Next.js, `waitUntil()` in Express on Vercel — never fire-and-forget without it.
- Rate limits on auth and write endpoints (stored in MongoDB, since memory is per instance).

## Smooth for the user
- Client JS budget: storefront first-load JS ≈ 150 KB max. Only small `"use client"` leaves.
- Heavy libraries (rich editor, charts, drag & drop, background-removal model) are dynamically
  imported **in dashboard routes only** and never reach the storefront bundle.
- Every async section has a `<Suspense>` fallback skeleton with the final size → no layout shift.
- Optimistic UI (`useOptimistic`) for add to cart, quantity, wishlist, dashboard toggles.
- Every submit button shows a pending state (`useFormStatus`) and can't be double-submitted.
- Forms validate instantly on the client with the same zod schema; the server validates again.
- Images: explicit `sizes`, fixed aspect-ratio containers, `priority` only for the LCP image,
  blur placeholders.
- Animations: Motion with LazyMotion + `m` components (see `motion-and-feedback.md`), `transform`/`opacity`
  only, reduced-motion respected — no scroll event listeners.
- Lists paginate/filter through URL params, rendered on the server.

## Budgets (checked before each phase is closed)
Lighthouse mobile ≥ 90 on home / shop / product · LCP < 2.5 s · CLS < 0.1 · INP < 200 ms.
