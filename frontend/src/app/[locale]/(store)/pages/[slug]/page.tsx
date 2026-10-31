import { Suspense } from "react";
import type { Metadata } from "next";
import { getPage } from "@/features/cms/api/cms.queries";
import { PageView } from "@/features/cms/components/page-view";
import { getLocale } from "@/shared/i18n/get-dictionary";
import { Skeleton } from "@/shared/ui/skeleton";

export async function generateMetadata({ params }: PageProps<"/[locale]/pages/[slug]">): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const page = await getPage(slug);
  return page ? { title: page.title[locale] } : {};
}

export default function InfoPageRoute({ params }: PageProps<"/[locale]/pages/[slug]">) {
  return (
    <Suspense fallback={<Skeleton className="mx-auto my-10 h-96 w-full max-w-3xl rounded-2xl" />}>
      <PageView params={params} />
    </Suspense>
  );
}
