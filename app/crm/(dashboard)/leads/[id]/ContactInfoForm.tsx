"use client";

import { useActionState } from "react";
import { updateLeadContact, type UpdateLeadContactState } from "../actions";
import { FormMessage } from "../../FormMessage";

export function ContactInfoForm({
  leadId,
  name,
  phone,
  company,
  email,
  message,
  locale,
}: {
  leadId: string;
  name: string;
  phone: string;
  company: string | null;
  email: string | null;
  message: string | null;
  locale: string;
}) {
  const [state, formAction, isPending] = useActionState<
    UpdateLeadContactState,
    FormData
  >(updateLeadContact, undefined);

  const inputClasses =
    "rounded-lg border border-paper-3 bg-white px-3 py-2 text-sm outline-none focus:border-brook";
  const labelClasses = "text-sm font-medium";

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="leadId" value={leadId} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className={labelClasses}>
            Név
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={name}
            className={inputClasses}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className={labelClasses}>
            Telefonszám
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            defaultValue={phone}
            className={inputClasses}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="company" className={labelClasses}>
            Cég / szervezet
          </label>
          <input
            id="company"
            name="company"
            type="text"
            defaultValue={company ?? ""}
            className={inputClasses}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className={labelClasses}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={email ?? ""}
            className={inputClasses}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className={labelClasses}>
          Üzenet / jegyzet
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          defaultValue={message ?? ""}
          className={inputClasses}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="locale" className={labelClasses}>
          Nyelv
        </label>
        <select
          id="locale"
          name="locale"
          defaultValue={locale}
          className={`w-40 ${inputClasses}`}
        >
          <option value="hu">Magyar</option>
          <option value="en">Angol</option>
        </select>
      </div>
      <div>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper disabled:opacity-60"
        >
          {isPending ? "Mentés..." : "Mentés"}
        </button>
      </div>
      {state?.error && <FormMessage type="error">{state.error}</FormMessage>}
    </form>
  );
}
