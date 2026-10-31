"use client";

import { Search } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/ui/input-group";

type ListSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
};

/** The round search box above dashboard lists. Pair it with `useUrlFilters` so the term lives in the URL. */
export function ListSearch({ value, onChange, placeholder, className }: ListSearchProps) {
  return (
    <InputGroup className={cn("h-10 w-full rounded-full sm:max-w-sm", className)}>
      <InputGroupAddon>
        <Search aria-hidden />
      </InputGroupAddon>
      <InputGroupInput type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-label={placeholder} />
    </InputGroup>
  );
}
