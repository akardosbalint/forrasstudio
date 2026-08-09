"use client";

import { useId, useState, type FormEvent } from "react";
import { MagneticButton } from "@/components/MagneticButton";
import type { Dictionary } from "@/dictionaries";
import type { Locale } from "@/lib/i18n/config";

type CallbackFormProps = {
  variant: "mini" | "full";
  source: string;
  lang: Locale;
  dict: Dictionary["site"]["callbackForm"];
  className?: string;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

const KNOWN_ERROR_CODES = [
  "INVALID_BODY",
  "MISSING_FIELDS",
  "CONSENT_REQUIRED",
  "NOT_CONFIGURED",
  "SAVE_FAILED",
] as const;

type KnownErrorCode = (typeof KNOWN_ERROR_CODES)[number];

function isKnownErrorCode(value: unknown): value is KnownErrorCode {
  return typeof value === "string" && (KNOWN_ERROR_CODES as readonly string[]).includes(value);
}

export function CallbackForm({ variant, source, lang, dict, className }: CallbackFormProps) {
  const formId = useId();
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);

    if (!data.get("consent")) {
      setErrorMessage(dict.errors.CONSENT_REQUIRED);
      setState("error");
      return;
    }

    const payload = {
      name: data.get("name"),
      phone: data.get("phone"),
      organization: data.get("organization"),
      email: data.get("email"),
      message: data.get("message"),
      source,
      consent: true,
      locale: lang,
    };

    try {
      const response = await fetch("/api/callback-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const code = body?.error;
        setErrorMessage(isKnownErrorCode(code) ? dict.errors[code] : dict.errors.GENERIC);
        setState("error");
        return;
      }

      form.reset();
      setState("success");
    } catch {
      setErrorMessage(dict.errors.NETWORK);
      setState("error");
    }
  }

  const inputClasses =
    "w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-paper placeholder:text-paper/40 outline-none transition-all duration-200 focus:border-spring focus:bg-white/10 focus:shadow-[0_0_0_3px_rgba(95,179,163,0.15)]";
  const labelClasses = "text-xs font-mono uppercase tracking-wider text-paper/60";

  if (state === "success") {
    return (
      <div
        role="status"
        className={`pop-in rounded-lg border border-spring/40 bg-spring/10 p-6 text-paper ${className ?? ""}`}
      >
        <p className="font-display text-xl">{dict.success.title}</p>
        <p className="mt-2 text-sm text-paper/70">{dict.success.body}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      <div className={variant === "mini" ? "flex flex-col gap-3 sm:flex-row" : "grid gap-4 sm:grid-cols-2"}>
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor={`${formId}-name`} className={labelClasses}>
            {dict.labels.name}
          </label>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder={dict.placeholders.name}
            className={inputClasses}
          />
        </div>

        {variant === "full" && (
          <div className="flex flex-1 flex-col gap-1.5">
            <label htmlFor={`${formId}-organization`} className={labelClasses}>
              {dict.labels.organization}{" "}
              <span className="normal-case text-paper/40">{dict.labels.organizationOptional}</span>
            </label>
            <input
              id={`${formId}-organization`}
              name="organization"
              type="text"
              autoComplete="organization"
              placeholder={dict.placeholders.organization}
              className={inputClasses}
            />
          </div>
        )}

        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor={`${formId}-phone`} className={labelClasses}>
            {dict.labels.phone}
          </label>
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            placeholder={dict.placeholders.phone}
            className={inputClasses}
          />
        </div>

        {variant === "full" && (
          <>
            <div className="flex flex-1 flex-col gap-1.5">
              <label htmlFor={`${formId}-email`} className={labelClasses}>
                {dict.labels.email}{" "}
                <span className="normal-case text-paper/40">{dict.labels.emailOptional}</span>
              </label>
              <input
                id={`${formId}-email`}
                name="email"
                type="email"
                autoComplete="email"
                placeholder={dict.placeholders.email}
                className={inputClasses}
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor={`${formId}-message`} className={labelClasses}>
                {dict.labels.message}{" "}
                <span className="normal-case text-paper/40">{dict.labels.messageOptional}</span>
              </label>
              <textarea
                id={`${formId}-message`}
                name="message"
                rows={3}
                placeholder={dict.placeholders.message}
                className={inputClasses}
              />
            </div>
          </>
        )}
      </div>

      <div className="mt-4 flex items-start gap-2.5">
        <input
          id={`${formId}-consent`}
          name="consent"
          type="checkbox"
          required
          className="mt-0.5 h-4 w-4 flex-shrink-0 accent-amber"
        />
        <label htmlFor={`${formId}-consent`} className="text-sm text-paper/70">
          {dict.consent.prefix}
          <a
            href={`/${lang}/adatvedelem`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-paper/30 hover:text-paper hover:decoration-spring"
          >
            {dict.consent.linkLabel}
          </a>
          {dict.consent.suffix}
        </label>
      </div>

      <MagneticButton
        type="submit"
        disabled={state === "submitting"}
        className="btn-shine bg-gradient-brand mt-4 w-full whitespace-nowrap rounded-full px-6 py-3 font-sans font-semibold text-white transition-shadow duration-200 hover:shadow-lg hover:shadow-amber/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none sm:w-auto"
      >
        {state === "submitting" ? dict.submitting : dict.submit}
      </MagneticButton>

      {state === "error" && (
        <p role="alert" className="pop-in mt-3 text-sm text-red-400">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
