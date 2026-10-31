# Naming

| Thing | Convention | Example |
|---|---|---|
| Files & folders | kebab-case | `product-card/product-card.tsx` |
| Component pattern files | `name.tsx`, `name.data.ts`, `name.ux.ts`, `name.action.ts` | |
| Backend module files | `name.model.ts`, `name.validation.ts`, `name.service.ts`, `name.controller.ts`, `name.routes.ts` | |
| React components | PascalCase | `ProductCard` |
| Hooks | `useXxx`, one per `.ux.ts` | `useProductGallery` |
| Server Actions | verb + noun | `addToCart`, `updateOrderStatus` |
| Data functions | `get`/`list` + noun | `getProduct`, `listFeaturedProducts` |
| Constants | UPPER_SNAKE | `ORDER_STATUSES` |
| Types | PascalCase, no `I` prefix | `ProductCardModel` |
| Mongo collections | plural lowercase (Mongoose default) | `products` |
| API paths | plural kebab-case | `/api/v1/custom-orders` |

- Named exports everywhere except where Next.js requires default exports (pages, layouts, route files).
- Comments explain *why*, not *what*. Keep them short.
