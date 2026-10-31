---
paths:
  - "frontend/**/*.{tsx,css}"
---

# Tailwind v4, shadcn/ui & design tokens

- Tokens are defined once in `frontend/src/shared/styles/globals.css`. There is no `tailwind.config.js`.
- Two layers of tokens:
  1. **shadcn semantic variables** (`:root`), set to the brand. Components use these:
     `bg-background text-foreground bg-card bg-popover bg-primary text-primary-foreground bg-secondary
     bg-muted text-muted-foreground bg-accent (= hover tint) bg-destructive border-border border-input
     ring-ring bg-sidebar-* chart-1…5`, radius via `--radius`.
  2. **Brand scales** (`@theme`) for decorative and brand-specific use:
     `primary-50…900`, `yarn-50…600` (logo red), `canvas`, `blush`, `ink`, `ink-muted`, `line`.
- Brand mapping: `--primary` = #832F88 · `--background` = linen #FAF6F1 · `--secondary` = blush ·
  `--destructive` = yarn red #C32C3C · `--ring` = primary-400 · `--radius` = 1rem.
- The red is called `yarn`, never `accent` — in shadcn, `accent` means the hover tint.
- Forbidden: arbitrary colors (`bg-[#832f88]`), inline `style={{ color }}`, new font imports in components.
  Need a new value? Add a token in `globals.css` and document it in `docs/DESIGN-SYSTEM.md`.
- Brand utilities: `stitch` (dashed stitched border). New ones are added with `@utility` in globals.css.
- Variants use `cva` (like shadcn's `button.tsx`), merged with `cn()` from `shared/lib/utils/cn`.
  No ternary chains of class strings.
- RTL (shadcn `rtl: true` + Radix `DirectionProvider` in the root layout):
  only logical utilities — `ms-* me-* ps-* pe-* start-* end-* text-start text-end border-s border-e
  rounded-s rounded-e`. Never `ml-* mr-* pl-* pr-* left-* right-* text-left text-right`.
  Directional icons flip with `rtl:-scale-x-100`.
- Mobile first: base classes for phones, then `sm: md: lg: xl:`.
- Motion: `motion-safe:` / `motion-reduce:` for decorative animation (thread lines, yarn spin).

- Every `<textarea>` is `resize-none` (set once in `shared/ui/textarea.tsx`; never re-enable `resize-y`).
- Everything clickable shows `cursor-pointer` (global rule in `globals.css` covers buttons, menu items, options,
  tabs, switches, checkboxes); disabled ones show `not-allowed`.
