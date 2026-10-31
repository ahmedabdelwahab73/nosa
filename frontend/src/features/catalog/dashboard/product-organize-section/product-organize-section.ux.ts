"use client";

import { useState, type KeyboardEvent } from "react";
import type { ProductFormApi } from "../product-form/product-form.ux";

export function useProductOrganize(form: ProductFormApi) {
  const [tag, setTag] = useState("");
  const [setItem, setSetItem] = useState({ ar: "", en: "" });

  const addTag = () => {
    const value = tag.trim();
    if (value && !form.draft.tags.includes(value)) form.update((d) => ({ ...d, tags: [...d.tags, value] }));
    setTag("");
  };

  return {
    tag,
    setTag,
    addTag,
    onTagKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
      // Enter adds the tag instead of submitting anything; Backspace on an empty box removes the last one.
      if (event.key === "Enter") {
        event.preventDefault();
        addTag();
      } else if (event.key === "Backspace" && !tag) {
        form.update((d) => ({ ...d, tags: d.tags.slice(0, -1) }));
      }
    },
    removeTag: (value: string) => form.update((d) => ({ ...d, tags: d.tags.filter((t) => t !== value) })),
    setItem,
    setSetItem,
    canAddSetItem: setItem.ar.trim() !== "" && setItem.en.trim() !== "",
    addSetItem: () => {
      form.update((d) => ({ ...d, setItems: [...d.setItems, { ar: setItem.ar.trim(), en: setItem.en.trim() }] }));
      setSetItem({ ar: "", en: "" });
    },
    removeSetItem: (index: number) => form.update((d) => ({ ...d, setItems: d.setItems.filter((_, i) => i !== index) })),
  };
}
