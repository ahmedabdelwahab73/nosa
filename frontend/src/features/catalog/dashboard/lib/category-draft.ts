import type { CategoryDto, CategoryInput, ImageAsset, LocalizedText } from "@nosa/contracts";

/** What the category dialog edits; `toCategoryInput` converts it for the API's zod schema. */
export type CategoryDraft = {
  name: LocalizedText;
  description: LocalizedText;
  slug: string;
  /** "" means a top-level category. */
  parent: string;
  image: ImageAsset[];
  isActive: boolean;
  order: number;
};

export const emptyCategoryDraft = (parent = ""): CategoryDraft => ({
  name: { ar: "", en: "" },
  description: { ar: "", en: "" },
  slug: "",
  parent,
  image: [],
  isActive: true,
  order: 0,
});

export const draftFromCategory = (category: CategoryDto): CategoryDraft => ({
  name: category.name,
  description: { ar: category.description?.ar ?? "", en: category.description?.en ?? "" },
  slug: category.slug,
  parent: category.parent ?? "",
  image: category.image ? [category.image] : [],
  isActive: category.isActive,
  order: category.order,
});

const partial = (value: LocalizedText) => ({
  ...(value.ar.trim() && { ar: value.ar.trim() }),
  ...(value.en.trim() && { en: value.en.trim() }),
});

export function toCategoryInput(draft: CategoryDraft) {
  const description = partial(draft.description);
  return {
    name: draft.name,
    ...(draft.slug.trim() && { slug: draft.slug.trim() }),
    ...(Object.keys(description).length > 0 && { description }),
    ...(draft.image[0] && { image: draft.image[0] }),
    parent: draft.parent || null,
    order: draft.order,
    isActive: draft.isActive,
  } satisfies Partial<CategoryInput>;
}

/** Categories as rows of a tree: parents first, each followed by its children, siblings by `order`. */
export function categoryRows(categories: CategoryDto[]) {
  const byParent = new Map<string | null, CategoryDto[]>();
  for (const category of categories) {
    const siblings = byParent.get(category.parent) ?? [];
    siblings.push(category);
    byParent.set(category.parent, siblings);
  }
  for (const siblings of byParent.values()) siblings.sort((a, b) => a.order - b.order);

  const rows: { category: CategoryDto; depth: number }[] = [];
  const visit = (parent: string | null, depth: number) => {
    for (const category of byParent.get(parent) ?? []) {
      rows.push({ category, depth });
      visit(category.id, depth + 1);
    }
  };
  visit(null, 0);
  return rows;
}

/** The ids of a category and everything under it — a parent can't be moved into its own subtree. */
export function descendantIds(categories: CategoryDto[], id: string): Set<string> {
  const ids = new Set([id]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const category of categories) {
      if (category.parent && ids.has(category.parent) && !ids.has(category.id)) {
        ids.add(category.id);
        grew = true;
      }
    }
  }
  return ids;
}
