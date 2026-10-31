# Product catalog

Derived from the reference photos in `docs/references/products/`.

> - Nosa's own work: `ref-2` (red/white dress + hat), `ref-6` (cardigan with bows), `ref-7` (pink bag),
>   `ref-10` (paw gloves), `ref-11` (kitty phone bag). `ref-8` is an AI lifestyle shot of the `ref-7` bag.
>   These have the logo/QR/watermark baked in — for the store, clean photos without overlays are
>   preferred (the site adds branding itself).
> - `ref-3` (unknown source), `ref-4` ("مشغولات فطوم"), `ref-5` ("Two Flowers"), `ref-9` ("Lamsety / Mona sa'ad")
>   belong to other makers. They are **style references only** — never publish them as Nosa products.

## Categories (initial)

| Slug | AR | EN | Examples |
|---|---|---|---|
| `baby-sets` | أطقم بيبي وبناتي | Baby & girls sets | Dress + hat/headband + booties (red/white, burgundy, mustard) |
| `kids-cardigans` | جواكت وكارديجان أطفال | Kids cardigans | Cream cardigan with burgundy bows |
| `bags` | شنط كروشيه | Crochet bags | Dusty-pink shoulder bag, kids character phone bag |
| `accessories` | إكسسوارات | Accessories | Paw fingerless gloves, headbands |
| `embroidery-gifts` | تطريز وهدايا بالاسم | Embroidery & personalised gifts | Hand-embroidered keepsakes with names/dates |

Categories are nested-capable (`parent`) and fully managed from the dashboard.

## Product model (phase 2)

- `name`, `description`, `careInstructions`: `LocalizedText`
- `slug` (unique), `category`, `tags[]`, `status: draft | published | archived`, `isFeatured`
- `images[]`: `{ publicId, width, height, format, transparentPublicId?, alt: LocalizedText }`
  (Cloudinary metadata only; sizes and formats are generated on delivery)
- `price`, `salePrice?`, `currency: EGP`
- `options[]`: e.g. `size` (0-3m, 3-6m, 6-12m, 1-2y, 2-3y, 3-4y...) and `color` (name + swatch hex)
- `variants[]`: `{ sku, optionValues, price?, stock?, isMadeToOrder }`
- `productionDays` — handmade lead time shown on the product page ("ready in 3-5 days")
- `setItems[]`: what's included in a set (dress, hat, booties) — `LocalizedText`
- `customization`: `{ enabled, fields[]: { key, label: LocalizedText, type: text|date|color|image|note, required, maxLength? }, extraPrice? }`
  - Embroidery: names + date; baby sets: optional name on headband; any product: notes.
- `seo`: `{ title?, description? }` (`LocalizedText`)

## Custom orders (separate flow)

"Design your own piece": customer describes the idea, picks category, size, colors, budget,
uploads reference images → dashboard queue (new → quoted → accepted → in production → delivered).
