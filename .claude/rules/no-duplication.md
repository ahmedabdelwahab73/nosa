# No duplication

Before writing a component, hook, helper, type, schema or style:

1. Search `frontend/src/shared/`, `backend/src/shared/` and `packages/contracts/` for an existing one.
   For UI, check shadcn/ui first (`npx shadcn@latest add ...`) before building any primitive by hand.
2. If something similar exists, extend it with a prop/variant instead of copying it.
3. The second time something is needed, extract it — don't wait for the third.

Where extracted things go:
| Needed by | Goes to |
|---|---|
| Frontend and backend | `packages/contracts` |
| Several frontend features | `frontend/src/shared/{ui,components,lib,hooks}` |
| Several components of one feature | `features/<domain>/lib` or `features/<domain>/components` |
| Several backend modules | `backend/src/shared/{db,http,middlewares,services}` |

Typical things that MUST be shared, never re-implemented:
- Price display, discount badge, rating stars, empty states, skeletons, pagination, data tables,
  form fields, modals/drawers, image uploader, status badges (order/payment) — `shared/ui` or `shared/components`.
- Localized-text sub-schema, image sub-schema, slug generation, pagination — `backend/src/shared`.
- Enums and status lists — `@nosa/contracts` (never retype `"pending" | "shipped"` by hand).
- Styling: variants via props + `cn()`; never copy-paste long class strings between components.
