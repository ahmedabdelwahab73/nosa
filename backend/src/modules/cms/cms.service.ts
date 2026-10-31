import sanitizeHtml from "sanitize-html";
import { waitUntil } from "@vercel/functions";
import { z } from "zod";
import { CACHE_TAGS, type HomeSectionDto, type PageDto, type homeSectionInputSchema, type pageInputSchema } from "@nosa/contracts";
import { ApiError } from "@/shared/http/api-error";
import { revalidateFrontend } from "@/shared/services/next-revalidate.service";
import { HomeSectionModel, PageModel } from "./cms.model";

/** Rich text from the editor: keep formatting, drop scripts, styles and event handlers. */
const cleanHtml = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: ["p", "br", "strong", "em", "u", "s", "h2", "h3", "h4", "ul", "ol", "li", "blockquote", "a", "hr"],
    allowedAttributes: { a: ["href", "target", "rel"] },
    allowedSchemes: ["https", "mailto", "tel"],
    transformTags: { a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }) },
  });

const sectionDto = (doc: InstanceType<typeof HomeSectionModel>): HomeSectionDto => ({
  id: doc.id,
  order: doc.order,
  isActive: doc.isActive,
  content: doc.content,
});

const pageDto = (doc: InstanceType<typeof PageModel>): PageDto => doc.toJSON() as unknown as PageDto;

const revalidateHome = () => waitUntil(revalidateFrontend([CACHE_TAGS.cms]));

// ── Home sections ──────────────────────────────────────────────────────────

export async function listHomeSections({ includeInactive = false } = {}) {
  const docs = await HomeSectionModel.find(includeInactive ? {} : { isActive: true }).sort({ order: 1 });
  return docs.map(sectionDto);
}

export async function createHomeSection(input: z.infer<typeof homeSectionInputSchema>, actorId: string) {
  const last = await HomeSectionModel.findOne().sort({ order: -1 }).select("order");
  const doc = await HomeSectionModel.create({ ...input, order: (last?.order ?? -1) + 1, updatedBy: actorId });
  revalidateHome();
  return sectionDto(doc);
}

export async function updateHomeSection(id: string, input: z.infer<typeof homeSectionInputSchema>, actorId: string) {
  const doc = await HomeSectionModel.findByIdAndUpdate(id, { ...input, updatedBy: actorId }, { new: true });
  if (!doc) throw ApiError.notFound("Section");
  revalidateHome();
  return sectionDto(doc);
}

export async function deleteHomeSection(id: string) {
  const result = await HomeSectionModel.deleteOne({ _id: id });
  if (!result.deletedCount) throw ApiError.notFound("Section");
  revalidateHome();
}

export async function reorderHomeSections(ids: string[]) {
  await HomeSectionModel.bulkWrite(ids.map((id, order) => ({ updateOne: { filter: { _id: id }, update: { order } } })));
  revalidateHome();
  return listHomeSections({ includeInactive: true });
}

// ── Pages ──────────────────────────────────────────────────────────────────

export async function getPublishedPage(slug: string) {
  const doc = await PageModel.findOne({ slug, isPublished: true });
  if (!doc) throw ApiError.notFound("Page");
  return pageDto(doc);
}

export async function listPages() {
  const docs = await PageModel.find().select("slug title body isPublished updatedAt").sort({ slug: 1 });
  return docs.map(pageDto);
}

export async function upsertPage(input: z.infer<typeof pageInputSchema>) {
  const body = { ar: cleanHtml(input.body.ar), en: cleanHtml(input.body.en) };
  // The footer lists published pages, so it is refreshed together with the page itself.
  const doc = await PageModel.findOneAndUpdate({ slug: input.slug }, { ...input, body }, { upsert: true, new: true, runValidators: true });
  waitUntil(revalidateFrontend([CACHE_TAGS.page(doc.slug), CACHE_TAGS.cms]));
  return pageDto(doc);
}

export async function deletePage(slug: string) {
  const result = await PageModel.deleteOne({ slug });
  if (!result.deletedCount) throw ApiError.notFound("Page");
  waitUntil(revalidateFrontend([CACHE_TAGS.page(slug), CACHE_TAGS.cms]));
}
