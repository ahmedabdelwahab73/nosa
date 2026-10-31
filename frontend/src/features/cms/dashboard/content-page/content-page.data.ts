import "server-only";
import { getAccessToken } from "@/shared/lib/auth";
import { cmsDashboardApi } from "../../api/cms.dashboard.api";

/** Request-time read of every section (shown and hidden) plus the categories the picker needs. */
export async function getHomeEditorData() {
  const token = await getAccessToken();
  if (!token) throw new Error("UNAUTHORIZED");
  const [sections, categories] = await Promise.all([cmsDashboardApi.sections(token), cmsDashboardApi.categories()]);
  return { sections: sections.data, categories: categories.data.map(({ slug, name }) => ({ slug, name })) };
}

/** Every page, published or not, with its body so the dialog can edit it. */
export async function listEditablePages() {
  const token = await getAccessToken();
  if (!token) throw new Error("UNAUTHORIZED");
  return (await cmsDashboardApi.pages(token)).data;
}
