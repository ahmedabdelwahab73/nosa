@AGENTS.md

# Frontend (Next.js 16)

Project-wide rules live in the root `CLAUDE.md` and `.claude/rules/`. This file covers frontend specifics.

## Config facts

- `cacheComponents: true` + `partialPrefetching: true` (next.config.ts). `"use cache"` is the caching model; `unstable_cache`/`fetch` cache options are not used.
- Middleware is called **Proxy** in Next 16: `src/proxy.ts`. Its logic lives in modules (e.g. `shared/i18n/locale-proxy.ts`).
- Locale is the root segment `app/[locale]`. Read it anywhere on the server with `getLocale()` (built on `next/root-params`), never via prop drilling.
- `@nosa/contracts` is consumed as TS source via `transpilePackages`.
- Env: server-only vars are read through `shared/config/env.server.ts` (zod-validated). Only `NEXT_PUBLIC_*` may reach the client.
- shadcn/ui: `components.json` (style `radix-nova`, `rtl: true`), aliases → `@/shared/ui`, `@/shared/lib/utils/cn`,
  `@/shared/components`, `@/shared/lib`, `@/shared/hooks`. Add primitives with `npx shadcn@latest add <name>`.
- Images: `next/image` with the Cloudinary loader (`shared/lib/media/cloudinary-loader.ts`) — no Vercel image optimization.
- Deployed on Vercel (Hobby) in region `fra1`.

## Layout

```
src/
├── app/                    # routes only — thin pages that compose features
│   ├── [locale]/
│   │   ├── layout.tsx      # root layout: <html lang dir>, fonts, DirectionProvider, metadata
│   │   ├── (store)/        # storefront routes + store chrome
│   │   ├── (auth)/         # login (phone-first flow + Google)
│   │   └── dashboard/      # admin routes + dashboard chrome
│   ├── api/revalidate/     # called by Express after writes
│   └── icon.png
├── features/<domain>/      # catalog, cart, checkout, orders, account, auth, reviews, stories, cms, ...
│   ├── api/<domain>.api.ts # server-only endpoint wrappers (one function per backend endpoint)
│   ├── components/         # storefront components (component pattern)
│   ├── dashboard/          # dashboard components for the same domain
│   ├── lib/                # pure helpers for this domain
│   └── types.ts
├── shared/
│   ├── ui/                 # shadcn/ui primitives (flat, CLI-managed)
│   ├── components/         # our composites: logo, locale-switcher, price, rating, data-table, image-uploader, ...
│   ├── lib/api/http.ts     # the ONLY fetch wrapper
│   ├── lib/auth/           # getSession, requireUser, requireRole
│   ├── lib/media/          # Cloudinary loader + URL helpers
│   ├── lib/utils/          # cn, formatters
│   ├── i18n/               # dictionaries, getLocale/getDictionary, locale proxy
│   ├── config/             # site config, env
│   ├── hooks/              # generic client hooks
│   └── styles/             # globals.css (tokens), fonts.ts
└── proxy.ts
```
