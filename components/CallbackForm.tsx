"use client";

import { useId, useState, type FormEvent } from "react";
import { MagneticButton } from "@/components/MagneticButton";

type CallbackFormProps = {
  variant: "mini" | "full";
  source: string;
  className?: string;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

export function CallbackForm({ variant, source, className }: CallbackFormProps) {
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
      setErrorMessage("Az adatkezelési tájékoztató elfogadása kötelező.");
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
    };

    try {
      const response = await fetch("/api/callback-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setErrorMessage(
          body?.error ?? "Nem sikerült elküldeni a kérésed. Kérjük, próbáld újra.",
        );
        setState("error");
        return;
      }

      form.reset();
      setState("success");
    } catch {
      setErrorMessage(
        "Nem sikerült elküldeni a kérésed. Ellenőrizd a kapcsolatot, és próbáld újra.",
      );
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
        <p className="font-display text-xl">Köszönjük, hamarosan hívunk!</p>
        <p className="mt-2 text-sm text-paper/70">
          Megkaptuk a kérésed, egy munkanapon belül jelentkezünk telefonon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      <div className={variant === "mini" ? "flex flex-col gap-3 sm:flex-row" : "grid gap-4 sm:grid-cols-2"}>
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor={`${formId}-name`} className={labelClasses}>
            Név
          </label>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Teljes név"
            className={inputClasses}
          />
        </div>

        {variant === "full" && (
          <div className="flex flex-1 flex-col gap-1.5">
            <label htmlFor={`${formId}-organization`} className={labelClasses}>
              Cég / szervezet neve <span className="normal-case text-paper/40">(opcionális)</span>
            </label>
            <input
              id={`${formId}-organization`}
              name="organization"
              type="text"
              autoComplete="organization"
              placeholder="Cég vagy szervezet neve"
              className={inputClasses}
            />
          </div>
        )}

        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor={`${formId}-phone`} className={labelClasses}>
            Telefonszám
          </label>
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            placeholder="+36 30 000 0000"
            className={inputClasses}
          />
        </div>

        {variant === "full" && (
          <>
            <div className="flex flex-1 flex-col gap-1.5">
              <label htmlFor={`${formId}-email`} className={labelClasses}>
                Email <span className="normal-case text-paper/40">(opcionális)</span>
              </label>
              <input
                id={`${formId}-email`}
                name="email"
                type="email"
                autoComplete="email"
                placeholder="nev@cegnev.hu"
                className={inputClasses}
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor={`${formId}-message`} className={labelClasses}>
                Üzenet <span className="normal-case text-paper/40">(opcionális)</span>
              </label>
              <textarea
                id={`${formId}-message`}
                name="message"
                rows={3}
                placeholder="Mesélj pár szóban a vállalkozásodról, és miben segíthetünk."
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
          Elfogadom az{" "}
          <a
            href="/adatvedelem"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-paper/30 hover:text-paper hover:decoration-spring"
          >
            adatkezelési tájékoztatót
          </a>
          , és hozzájárulok, hogy a MI Építettük a megadott adataimat a
          kapcsolatfelvétel céljából kezelje.
        </label>
      </div>

      <MagneticButton
        type="submit"
        disabled={state === "submitting"}
        className="btn-shine bg-gradient-brand mt-4 w-full whitespace-nowrap rounded-full px-6 py-3 font-sans font-semibold text-white transition-shadow duration-200 hover:shadow-lg hover:shadow-amber/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none sm:w-auto"
      >
        {state === "submitting" ? "Küldés…" : "Hívjatok vissza"}
      </MagneticButton>

      {state === "error" && (
        <p role="alert" className="pop-in mt-3 text-sm text-red-400">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
