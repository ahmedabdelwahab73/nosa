"use client";

import { Images } from "lucide-react";
import { ImageUploader, type ImageUploaderLabels } from "@/shared/components/image-uploader";
import { Panel } from "@/shared/components/panel";
import type { FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import type { SectionProps } from "../lib/section-props";

type ProductImagesSectionProps = SectionProps & {
  uploaderLabels: ImageUploaderLabels;
  messages: FeedbackMessages;
};

export function ProductImagesSection({ form, labels, uploaderLabels, messages }: ProductImagesSectionProps) {
  return (
    <Panel title={labels.images.title} icon={<Images />}>
      <ImageUploader
        folder="products"
        value={form.draft.images}
        onChange={(images) => form.update((d) => ({ ...d, images }))}
        labels={uploaderLabels}
        feedback={messages}
        maxFiles={12}
        error={form.error("images")}
      />
    </Panel>
  );
}
