import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS, type HomeSectionDto, type PageDto } from "@nosa/contracts";
import { HttpError, http } from "@/shared/lib/api/http";

/** Active home sections in the owner's order. Empty until she arranges the page in the dashboard. */
export async function getHomeSections() {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.cms);
  return (await http<HomeSectionDto[]>("/cms/home")).data;
}

/** The info pages the footer links to; a slug the owner has not published yet is simply left out. */
const FOOTER_PAGE_SLUGS = ["about", "shipping-returns", "faq", "contact"] as const;

export async function getFooterPages() {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.cms);
  const pages = await Promise.all(
    FOOTER_PAGE_SLUGS.map((slug) =>
      http<PageDto>(`/cms/pages/${slug}`)
        .then(({ data }) => ({ slug, title: data.title }))
        .catch(() => null),
    ),
  );
  return pages.filter((page) => page !== null);
}

/** One published info page, or null when it does not exist (the route turns that into a 404). */
export async function getPage(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.page(slug));
  try {
    return (await http<PageDto>(`/cms/pages/${encodeURIComponent(slug)}`)).data;
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) return null;
    throw error;
  }
}
