---
paths:
  - "frontend/**"
---

# Animation (Motion) & action feedback

## Motion (`motion` package, free)
- Provider: `AppProviders` wraps the app in `LazyMotion features={domAnimation} strict` + `MotionConfig reducedMotion="user"`.
- Use **only** `m.*` components from `motion/react-m` (never `motion.*` — `strict` throws).
- Variants and transitions come from `shared/lib/motion/presets.ts` (`fadeUp`, `fadeIn`, `scaleIn`,
  `stagger`, `drawThread`, `EASE_THREAD`). No inline magic numbers; add a preset instead.
- Server Components animate content by wrapping it in `<Reveal>` / `<RevealGroup>`
  (`shared/components/reveal`) — they stay Server Components.
- Animate `opacity`/`transform`/`pathLength` only. Entrance animations run once (`inViewOnce`).
- Heavier gestures (drag, layout animations, AnimatePresence-heavy flows) only in client leaves that need them.
- Simple hover/focus transitions stay plain Tailwind (`transition-*`, `ease-thread`).

## Every mutation shows a result (store and dashboard)
- Server Actions return `ActionState` (`shared/lib/action-state`): `actionSuccess("created" | "updated" |
  "deleted" | "saved" | "sent", data)` or `toActionFailure(error)` in the catch.
- The client leaf calls `useActionFeedback(state, messages)` (`shared/hooks/use-action-feedback.ts`):
  success → green toast "اتضاف بنجاح ✓", failure → red toast with the translated reason.
- `messages` come from `await getFeedbackMessages()` in the Server parent (actions can't read the locale).
- Field errors are also shown inline under their inputs.
- No mutation may finish silently. Example: `src/app/[locale]/dev/ui/_feedback-demo/`.
