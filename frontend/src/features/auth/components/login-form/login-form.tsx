"use client";

import type { Locale } from "@nosa/contracts";
import type { FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import type { Dictionary } from "@/shared/i18n/get-dictionary";
import { Button } from "@/shared/ui/button";
import { Field, FieldError, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/shared/ui/input-group";
import { Spinner } from "@/shared/ui/spinner";
import { useLoginForm } from "./login-form.ux";

type LoginFormProps = {
  locale: Locale;
  next?: string;
  labels: Dictionary["auth"];
  messages: FeedbackMessages;
};

export function LoginForm({ locale, next, labels, messages }: LoginFormProps) {
  const { formAction, pending, step, phoneError, nameError, passwordError, validatePhone, changeNumber } =
    useLoginForm(messages);
  const fieldError = (code: string | null) =>
    code ? (labels.fieldErrors[code as keyof typeof labels.fieldErrors] ?? labels.fieldErrors.REQUIRED) : null;

  return (
    <form action={formAction} onSubmit={validatePhone} className="flex flex-col gap-4" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="next" value={next ?? ""} />

      {step ? (
        <>
          <input type="hidden" name="phone" value={step.phone} />
          <input type="hidden" name="intent" value={step.step} />
          <div className="flex items-center justify-between rounded-2xl bg-secondary px-4 py-2 text-sm">
            <span dir="ltr" className="font-medium text-primary-800">{step.phone}</span>
            <button type="button" onClick={changeNumber} className="text-primary underline-offset-4 hover:underline">
              {labels.changeNumber}
            </button>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-primary-800">
              {step.step === "login" ? labels.loginTitle : labels.registerTitle}
            </h2>
            <p className="text-sm text-muted-foreground">
              {step.step === "login" ? labels.loginSubtitle : labels.registerSubtitle}
            </p>
          </div>
          {step.step === "register" && (
            <Field data-invalid={!!nameError}>
              <FieldLabel htmlFor="name">{labels.name}</FieldLabel>
              <Input id="name" name="name" autoComplete="name" placeholder={labels.namePlaceholder} required aria-invalid={!!nameError} />
              {nameError && <FieldError>{fieldError(nameError)}</FieldError>}
            </Field>
          )}
          <Field data-invalid={!!passwordError}>
            <FieldLabel htmlFor="password">{labels.password}</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={step.step === "login" ? "current-password" : "new-password"}
              autoFocus
              required
              aria-invalid={!!passwordError}
              dir="ltr"
            />
            {step.step === "register" && !passwordError && <p className="text-xs text-muted-foreground">{labels.passwordHint}</p>}
            {passwordError && <FieldError>{fieldError(passwordError)}</FieldError>}
          </Field>
          <Button size="xl" disabled={pending}>
            {pending && <Spinner />}
            {step.step === "login" ? labels.login : labels.createAccount}
          </Button>
        </>
      ) : (
        <>
          <input type="hidden" name="intent" value="check" />
          <Field data-invalid={!!phoneError}>
            <FieldLabel htmlFor="phone">{labels.phone}</FieldLabel>
            <InputGroup className="h-12 rounded-2xl" dir="ltr">
              <InputGroupAddon>
                <InputGroupText>+20</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder={labels.phonePlaceholder}
                autoFocus
                required
                aria-invalid={!!phoneError}
              />
            </InputGroup>
            {phoneError && <FieldError>{fieldError(phoneError)}</FieldError>}
          </Field>
          <Button size="xl" disabled={pending}>
            {pending && <Spinner />}
            {labels.continue}
          </Button>
        </>
      )}
    </form>
  );
}
