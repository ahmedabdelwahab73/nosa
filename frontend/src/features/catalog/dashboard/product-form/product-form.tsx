"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@nosa/contracts";
import type { ImageUploaderLabels } from "@/shared/components/image-uploader";
import type { FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import type { Dictionary } from "@/shared/i18n/get-dictionary";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";
import type { ProductDraft } from "../lib/product-draft";
import { ProductBasicsSection } from "../product-basics-section";
import { ProductCustomizationSection } from "../product-customization-section";
import { ProductImagesSection } from "../product-images-section";
import { ProductOrganizeSection } from "../product-organize-section";
import { ProductPricingSection } from "../product-pricing-section";
import { ProductPublishSection } from "../product-publish-section";
import { ProductVariantsSection } from "../product-variants-section";
import { useProductForm } from "./product-form.ux";

type ProductFormProps = {
  productId: string | null;
  initial: ProductDraft;
  locale: Locale;
  labels: Dictionary["dashboard"]["productForm"];
  statusLabels: Dictionary["dashboard"]["products"]["status"];
  uploaderLabels: ImageUploaderLabels;
  messages: FeedbackMessages;
  categories: { id: string; name: { ar: string; en: string } }[];
  listHref: string;
};

export function ProductForm({ productId, initial, locale, labels, statusLabels, uploaderLabels, messages, categories, listHref }: ProductFormProps) {
  const form = useProductForm({ productId, initial, messages, errorLabels: labels.errors, invalidMessage: labels.invalid, listHref });
  const section = { form, labels, locale };
  const isDraft = form.draft.status === "draft";

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-center gap-3">
        <Button asChild variant="ghost" size="icon" aria-label={labels.back}>
          <Link href={listHref}>
            <ArrowRight className="ltr:rotate-180" />
          </Link>
        </Button>
        <div className="me-auto">
          <h1 className="font-display text-2xl font-semibold text-primary-800 sm:text-3xl">{productId ? labels.title.edit : labels.title.new}</h1>
          <p className="text-muted-foreground">{labels.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="lg" className="h-10 px-5" disabled={form.pending} onClick={() => form.save()}>
            {form.pending && <Spinner />}
            {isDraft ? labels.saveDraft : labels.save}
          </Button>
          {isDraft && (
            <Button type="button" size="lg" className="h-10 px-5" disabled={form.pending} onClick={() => form.save("published")}>
              {labels.publish}
            </Button>
          )}
        </div>
      </header>

      <div className="grid items-start gap-5 xl:grid-cols-3">
        <div className="flex flex-col gap-5 xl:col-span-2">
          <ProductBasicsSection {...section} />
          <ProductPricingSection {...section} />
          <ProductVariantsSection {...section} />
          <ProductCustomizationSection {...section} />
        </div>
        <div className="flex flex-col gap-5">
          <ProductImagesSection {...section} uploaderLabels={uploaderLabels} messages={messages} />
          <ProductOrganizeSection {...section} categories={categories} />
          <ProductPublishSection {...section} statusLabels={statusLabels} />
        </div>
      </div>
    </div>
  );
}
