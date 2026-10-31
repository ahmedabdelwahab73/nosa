"use client";

import { useState } from "react";
import type { OptionValueDraft } from "../lib/product-draft";
import { slugify } from "../lib/variants";

const DEFAULT_HEX = "#832f88";

export function useOptionValuesEditor(values: OptionValueDraft[], onChange: (values: OptionValueDraft[]) => void) {
  const [ar, setAr] = useState("");
  const [en, setEn] = useState("");
  const [hex, setHex] = useState(DEFAULT_HEX);

  const key = slugify(en) || slugify(ar);
  // Without Latin letters in either name we still need a stable key, so number it.
  const value = key || `v${values.length + 1}`;
  const canAdd = ar.trim() !== "" && en.trim() !== "" && !values.some((existing) => existing.value === value);

  return {
    ar,
    en,
    hex,
    setAr,
    setEn,
    setHex,
    canAdd,
    add: () => {
      if (!canAdd) return;
      onChange([...values, { value, label: { ar: ar.trim(), en: en.trim() }, hex }]);
      setAr("");
      setEn("");
    },
    remove: (target: string) => onChange(values.filter((existing) => existing.value !== target)),
  };
}
