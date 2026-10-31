# Architecture

## Request flow

```
Browser ──► Next.js on Vercel (SSR / Server Components / Server Actions) ──► Express on Vercel ──► MongoDB Atlas
   │           ▲                                                               │
   │           └────────────── POST /api/revalidate {tags} ◄───────────────────┘  (after writes / jobs)
   └──► Cloudinary (signed direct uploads; images served from Cloudinary CDN)

cron-job.org ──► Express /api/v1/jobs/* (hourly / weekly / daily)
```

- The browser never calls Express directly. All reads/writes go through Next.js on the server
  (`shared/lib/api/http.ts`), so tokens stay in httpOnly cookies and the API URL stays private.
- The only direct browser → third-party traffic is uploads to Cloudinary (signed by Express) and
  Google Sign-In.

## Hosting (free tiers)

| Piece | Service | Notes |
|---|---|---|
| Frontend | Vercel Hobby, project `frontend/`, region `fra1` | Hobby terms are non-commercial: move to Pro or another host once the store sells for real |
| Backend | Vercel Hobby, project `backend/` (Express as a Function), `fra1` | `app.ts` exported, `server.ts` local only |
| Database | MongoDB Atlas M0, Frankfurt (`eu-central-1`) | 512 MB, network access `0.0.0.0/0` + strong credentials |
| Media | Cloudinary Free | signed direct uploads, `f_auto,q_auto` delivery |
| Email | Gmail SMTP with an app password (brand Gmail account) | ~500/day |
| Cron | cron-job.org | calls `/api/v1/jobs/*` with `x-cron-secret` |
| Monitoring | Sentry Developer + Vercel logs | request id on both sides |

Locally: MongoDB service on the machine, `npm run dev:api` + `npm run dev:web`.

## Caching & revalidation

1. Public reads in `*.data.ts` use `"use cache"` + `cacheLife` + `cacheTag(CACHE_TAGS.x)`.
2. A dashboard edit hits Express through a Server Action. The action calls `updateTag()` so the editor
   sees the change immediately.
3. The Express service also calls `revalidateFrontend([...tags])` (after the response, via `waitUntil`),
   so changes made anywhere (other admins, jobs like Instagram sync) refresh the storefront through
   `revalidateTag(tag, { expire: 0 })` (immediate: the owner must never see her own change one visit late).
4. Tag names live in `@nosa/contracts`, so both sides use identical strings.

Result: product/category/home pages are served as prerendered static HTML and still update within
seconds of an edit. Almost no server work per visitor.

## Auth

**Customer experience**
- **Google:** One Tap prompt + "Continue with Google" button (Google Identity Services).
- **Phone-first flow:** enter phone → existing number asks for the password; new number asks for
  name + password and creates the account. There is no separate register page.
- Login opens in a side sheet during checkout. Guest checkout is a dashboard setting.
- Google users give their phone once, at their first order.
- Sessions last 60 days (rotating refresh token).

**Phone numbers**
- Egyptian formats are normalised to `+201XXXXXXXXX` (prefixes 10/11/12/15).
- The shared zod schema lives in contracts.

**Forgot password (free)**
- Phone users: a pre-filled WhatsApp chat with the store opens; the admin generates a one-time reset
  link from the dashboard.
- Users with an email get the reset link by email.

**Technical**
- Google ID token → Server Action → Express `POST /auth/google`. Express verifies it with
  `google-auth-library` and creates or links the user.
- Express issues an access JWT (15 min) + a refresh token (60 days, hashed in the DB, rotated on use).
- Next.js Server Actions store both in httpOnly, `secure`, `sameSite=lax` cookies.
- `shared/lib/auth` (DAL) gives `getSession()` (inside `<Suspense>`), `requireUser()` and
  `requireRole()`. Tokens are passed explicitly to `http(path, { token })`.
- Defense in depth: `proxy.ts` optimistic redirect, then the DAL in the page/action, then `requireRole`
  in Express.
- Roles: `customer · staff · editor · admin · owner`. Staff accounts are created by the owner.
- Rate limits on phone check / login / reset, stored in MongoDB.

**User model**
`phone` (unique, sparse) · `passwordHash?` (argon2) · `googleId?` (unique, sparse) · `email?` ·
`avatar?` · `providers[]` · `role` · `addresses[]` · `isActive`.

## Cart

Server-side cart document keyed by a `cartId` cookie (guest) or the user id; merged on login.
Prices are always recalculated on the server. The header count streams in behind `<Suspense>`,
so pages stay static.

## Orders & stock

- Checkout is idempotent (`idempotency-key`).
- Stock is decremented with conditional atomic updates, so it can never oversell, and restored if the
  order fails.
- Status changes follow a state machine and are recorded in `statusHistory` + the audit log.
- Payment providers sit behind a `PaymentProvider` interface: COD is live; Paymob/wallet/InstaPay are
  placeholders.
- Shipping providers sit behind a `ShippingProvider` interface: flat rate per governorate now, Bosta later.

## Background jobs (HTTP-triggered)

| Job | Schedule | Endpoint |
|---|---|---|
| Instagram stories sync | hourly | `POST /api/v1/jobs/instagram-sync` |
| Meta token refresh | weekly | `POST /api/v1/jobs/meta-token-refresh` |
| Old carts / expired tokens cleanup | daily | `POST /api/v1/jobs/cleanup` |
