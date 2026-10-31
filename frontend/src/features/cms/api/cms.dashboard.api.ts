import "server-only";
import type { CategoryNode, HomeSectionDto, PageDto } from "@nosa/contracts";
import type { z } from "zod";
import type { homeSectionInputSchema, pageInputSchema } from "@nosa/contracts";
import { http } from "@/shared/lib/api/http";

type SectionInput = z.input<typeof homeSectionInputSchema>;
type PageInput = z.input<typeof pageInputSchema>;

/** Dashboard content endpoints (editors, admins and owners write; Express checks the role on each call). */
export const cmsDashboardApi = {
  /** Top-level categories, for the picker of the categories section. */
  categories: () => http<CategoryNode[]>("/categories"),
  sections: (token: string) => http<HomeSectionDto[]>("/dashboard/cms/home", { token }),
  createSection: (token: string, body: SectionInput) => http<HomeSectionDto>("/dashboard/cms/home", { method: "POST", token, body }),
  updateSection: (token: string, id: string, body: SectionInput) => http<HomeSectionDto>(`/dashboard/cms/home/${id}`, { method: "PUT", token, body }),
  deleteSection: (token: string, id: string) => http<unknown>(`/dashboard/cms/home/${id}`, { method: "DELETE", token }),
  reorderSections: (token: string, ids: string[]) => http<HomeSectionDto[]>("/dashboard/cms/home/reorder", { method: "PUT", token, body: { ids } }),
  pages: (token: string) => http<PageDto[]>("/dashboard/cms/pages", { token }),
  savePage: (token: string, body: PageInput) => http<PageDto>("/dashboard/cms/pages", { method: "PUT", token, body }),
  deletePage: (token: string, slug: string) => http<unknown>(`/dashboard/cms/pages/${slug}`, { method: "DELETE", token }),
};
