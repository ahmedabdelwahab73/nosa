# Media: Cloudinary only

**Image bytes never touch our servers** (not Next.js, not Express, not MongoDB).

## Storage
- MongoDB stores only metadata: `{ publicId, width, height, format, alt: LocalizedText, transparentPublicId? }`
  (shared `image` sub-schema in `backend/src/shared/db`, type in `@nosa/contracts`).
- Folders: `nosa/products/{productId}` · `nosa/categories` · `nosa/cms` · `nosa/stories` ·
  `nosa/reviews` · `nosa/custom-orders`.

## Upload flow (signed, direct from the browser)
1. Client leaf asks a Server Action for an upload signature.
2. The action calls Express `POST /api/v1/media/sign` (auth required). Express signs
   `{ folder, timestamp, allowed_formats, max_file_size }` with `CLOUDINARY_API_SECRET`.
3. The browser uploads the file **directly to Cloudinary** with that signature.
4. The client sends the returned `public_id`/size to a Server Action, which saves it through Express.

Limits: staff images ≤ 10 MB; customer uploads (custom orders, reviews) ≤ 5 MB, images only,
their own folder, max 5 files.

## Background removal
Runs in the admin's browser before upload (lazy-loaded, dashboard only), with an open model whose
license allows commercial use. The admin sees before/after and chooses; the transparent PNG becomes
the main image.

## Display
- Always `next/image` with the shared Cloudinary loader (`frontend/src/shared/lib/media/cloudinary-loader.ts`)
  → `f_auto,q_auto,w_{width}`. This bypasses Vercel image optimization quota.
- Never hard-code `res.cloudinary.com` URLs; build every URL through the shared helper.
- Blur placeholder from a tiny Cloudinary transform (`w_24,e_blur`).

## Other
- Instagram stories: Express calls Cloudinary upload **with the Meta media URL** — Cloudinary fetches it.
- Deleting a product/story deletes its Cloudinary assets (from Express, after the response).
- Secrets: `CLOUDINARY_API_SECRET` / `API_KEY` backend only. Frontend gets only
  `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`.
- Free plan: don't create transformations nobody uses; reuse a small fixed set of widths.
