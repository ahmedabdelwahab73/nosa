"use client";

import { useId, type ComponentProps } from "react";
import { cn } from "@/shared/lib/utils";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";

type TextFieldProps = Omit<ComponentProps<typeof Input>, "onChange" | "value"> & {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  /** Already translated error message; also marks the input invalid. */
  error?: string;
  hint?: string;
};

/** A labelled input with its hint and inline error: the one form field the dashboard repeats everywhere. */
export function TextField({ label, value, onValueChange, error, hint, className, required, ...props }: TextFieldProps) {
  const id = useId();

  return (
    <Field data-invalid={!!error} className={className}>
      <FieldLabel htmlFor={id}>
        {label}
        {required && <span className={cn("text-destructive")}> *</span>}
      </FieldLabel>
      <Input id={id} value={value} onChange={(event) => onValueChange(event.target.value)} aria-invalid={!!error} {...props} />
      {hint && !error && <FieldDescription>{hint}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
