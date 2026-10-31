# Nosa Handmade Crafts — E-commerce

Bilingual (Arabic RTL default + English) e-commerce store with a full admin dashboard for an
Egyptian handmade brand: crochet baby dress sets, kids cardigans, crochet bags, accessories and
personalised hand embroidery. Instagram stories are synced into the site.

## Stack (MERN + Next.js) — free tiers only

| Part | Tech | Where |
|---|---|---|
| Frontend | Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, shadcn/ui (Radix, RTL), Motion | `frontend/` → Vercel |
| Backend | Node + Express 5 + TypeScript | `backend/` → Vercel (Functions) |
| Database | MongoDB via Mongoose | local `mongodb://127.0.0.1:27017/nosa` · production Atlas M0 |
| Media | Cloudinary (signed direct uploads) | never on our servers |
| Shared | Types, enums, zod schemas, cache tags | `packages/contracts/` (`@nosa/contracts`) |
| Auth | Phone + password, Google Sign-In (One Tap) | Express is the only auth authority |
| Jobs | HTTP cron endpoints triggered by cron-job.org (free) | `backend/src/jobs` |

npm workspaces — always run `npm install` from the repo root.

**Everything must stay free.** Before adding any service, library or plan, check that it has a free
tier that allows this project. If something would cost money, ask first.

## Commands (from repo root)

```bash
npm run dev          # backend + frontend together (api → http://localhost:4000/api/v1, web → http://localhost:3100)
npm run dev:api      # Express API only
npm run dev:web      # Next.js only (port 3100 — port 3000 is used by another project on this machine)
npm run typecheck    # all workspaces
npm run lint
npm run build
```

## Golden rules

1. **Never touch git or GitHub** (no init, commit, push, PR) unless the user explicitly asks.
2. **Plan before executing.** Don't start a new phase or big change until the user says to start.
3. **Server first.** Every component is a Server Component unless it truly needs the browser. See `.claude/rules/server-components.md`.
4. **Component pattern:** `name.tsx` + optional `name.data.ts` / `name.ux.ts` / `name.action.ts` + `index.ts`.
   shadcn primitives in `shared/ui/` are the only exception. See `.claude/rules/component-pattern.md`.
5. **No duplication.** Anything used twice moves to `shared/` (frontend), `src/shared/` (backend) or `@nosa/contracts` (both). Search before you create. See `.claude/rules/no-duplication.md`.
6. **Each folder owns only its own concern.** See `.claude/rules/folder-structure.md`.
7. **Light servers, smooth site.** See `.claude/rules/performance.md`.
8. **Errors are handled everywhere.** See `.claude/rules/error-handling.md`.
9. **Images only on Cloudinary**, uploaded directly from the browser. See `.claude/rules/media-cloudinary.md`.
10. **Design tokens only.** See `.claude/rules/tailwind-design-tokens.md`.
11. **Bilingual everything.** No hard-coded UI text; RTL-safe logical classes only. See `.claude/rules/i18n.md`.
12. **One API envelope.** See `.claude/rules/api-contract.md`.
13. **Every mutation shows a toast** (success or failure). Animations use Motion presets. See `.claude/rules/motion-and-feedback.md`.
14. Logo and product images use transparent/clean backgrounds. Never put the logo inside a white box.
15. Next.js 16 differs from older versions. Read `node_modules/next/dist/docs/` before using an API you are not sure about.
16. **Tables scroll inside themselves, the page does not; the header row stays fixed.** See `.claude/rules/tables.md`.

## Docs

- `docs/PLAN.md` — the full plan, decisions, phases, status
- `docs/ARCHITECTURE.md` — request flow, auth, caching, deployment
- `docs/DESIGN-SYSTEM.md` — colors, fonts, motifs
- `docs/PRODUCT-CATALOG.md` — categories, variants, customisation
- `docs/META-INTEGRATION.md` — Instagram stories sync
- `docs/CHATGPT-PROMPTS.md` — prompts used to generate the UI designs
- `docs/references/` — logo original + product reference photos
