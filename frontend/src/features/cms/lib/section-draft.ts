import { HOME_SECTION_TYPES, type HomeSectionContent, type HomeSectionType } from "@nosa/contracts";

export { HOME_SECTION_TYPES };

const blank = { ar: "", en: "" };

/** A new section of a type. Texts start empty on purpose: the form asks for them and the schema insists. */
export function emptySection(type: HomeSectionType): HomeSectionContent {
  switch (type) {
    case "hero":
      return { type, title: blank, primaryCta: { label: blank, href: "/shop" } };
    case "categories":
      return { type, title: blank, categorySlugs: [] };
    case "products":
      return { type, title: blank, source: "newest", limit: 8 };
    case "banner":
      return { type, title: blank };
    case "stories":
      return { type, title: blank };
    case "reviews":
      return { type, title: blank };
    case "richText":
      return { type, title: blank, body: blank };
  }
}
