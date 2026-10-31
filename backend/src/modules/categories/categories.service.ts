import { waitUntil } from "@vercel/functions";
import { CACHE_TAGS, type CategoryDto, type CategoryInput, type CategoryNode } from "@nosa/contracts";
import { ApiError } from "@/shared/http/api-error";
import { revalidateFrontend } from "@/shared/services/next-revalidate.service";
import { uniqueSlug } from "@/shared/utils/slug";
import { CategoryModel } from "./categories.model";

const toDto = (doc: InstanceType<typeof CategoryModel>) => {
  const json = doc.toJSON() as unknown as CategoryDto;
  return { ...json, parent: doc.parent ? String(doc.parent) : null };
};

function buildTree(categories: CategoryDto[]): CategoryNode[] {
  const nodes = new Map(categories.map((c) => [c.id, { ...c, children: [] as CategoryNode[] }]));
  const roots: CategoryNode[] = [];
  for (const node of nodes.values()) {
    const parent = node.parent ? nodes.get(node.parent) : undefined;
    (parent ? parent.children : roots).push(node);
  }
  return roots;
}

function revalidate(...slugs: string[]) {
  waitUntil(revalidateFrontend([CACHE_TAGS.categories, CACHE_TAGS.products, ...slugs.map(CACHE_TAGS.category)]));
}

export async function listCategories({ includeInactive = false } = {}) {
  const docs = await CategoryModel.find(includeInactive ? {} : { isActive: true }).sort({ order: 1, createdAt: 1 });
  return docs.map(toDto);
}

export async function getCategoryTree() {
  return buildTree(await listCategories());
}

export async function getCategoryBySlug(slug: string) {
  const doc = await CategoryModel.findOne({ slug, isActive: true });
  if (!doc) throw ApiError.notFound("Category");
  return toDto(doc);
}

/** The category and all of its descendants — used to filter products by a parent category. */
export async function getCategoryWithDescendantIds(slug: string) {
  const all = await CategoryModel.find({ isActive: true }).select("slug parent");
  const root = all.find((c) => c.slug === slug);
  if (!root) throw ApiError.notFound("Category");

  const ids = [root.id as string];
  for (let i = 0; i < ids.length; i++) {
    for (const c of all) if (c.parent && String(c.parent) === ids[i]) ids.push(c.id);
  }
  return ids;
}

async function assertValidParent(parent: string | null | undefined, selfId?: string) {
  if (!parent) return;
  if (parent === selfId) throw new ApiError("VALIDATION_ERROR", "A category can't be its own parent", { "body.parent": ["INVALID_PARENT"] });
  if (!(await CategoryModel.exists({ _id: parent }))) throw ApiError.notFound("Parent category");
}

export async function createCategory(input: CategoryInput) {
  await assertValidParent(input.parent);
  const doc = await CategoryModel.create({
    ...input,
    parent: input.parent ?? null,
    slug: await uniqueSlug(CategoryModel, input.slug ?? input.name.en),
  });
  revalidate(doc.slug);
  return toDto(doc);
}

export async function updateCategory(id: string, input: CategoryInput) {
  const doc = await CategoryModel.findById(id);
  if (!doc) throw ApiError.notFound("Category");
  await assertValidParent(input.parent, id);

  const oldSlug = doc.slug;
  doc.set({ ...input, parent: input.parent ?? null });
  if (input.slug && input.slug !== oldSlug) doc.slug = await uniqueSlug(CategoryModel, input.slug, id);
  await doc.save();

  revalidate(oldSlug, doc.slug);
  return toDto(doc);
}

export async function deleteCategory(id: string) {
  const doc = await CategoryModel.findById(id);
  if (!doc) throw ApiError.notFound("Category");

  // Lazy import: products.service imports this module too.
  const { hasProductsInCategory } = await import("@/modules/products/products.service");
  const [children, products] = await Promise.all([CategoryModel.exists({ parent: id }), hasProductsInCategory(id)]);
  if (children || products) {
    throw new ApiError("CONFLICT", "Category still has sub-categories or products");
  }

  await doc.deleteOne();
  revalidate(doc.slug);
}

export async function reorderCategories(ids: string[]) {
  await CategoryModel.bulkWrite(ids.map((id, order) => ({ updateOne: { filter: { _id: id }, update: { order } } })));
  revalidate();
}
