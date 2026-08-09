"use client";

import { useActionState } from "react";
import { createLead, type CreateLeadState } from "../actions";
import { FormMessage } from "../../FormMessage";
import type { Profile } from "@/generated/prisma/client";

export function NewLeadForm({ profiles }: { profiles: Profile[] }) {
  const [state, formAction, isPending] = useActionState<
    CreateLeadState,
    FormData
  >(createLead, undefined);

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Név *
        </label>
        <input
          id="name"
          name="name"
          required
          className="rounded-lg border border-paper-3 bg-white px-3 py-2 text-sm outline-none focus:border-brook"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="phone" className="text-sm font-medium">
          Telefonszám *
        </label>
        <input
          id="phone"
          name="phone"
          required
          className="rounded-lg border border-paper-3 bg-white px-3 py-2 text-sm outline-none focus:border-brook"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="company" className="text-sm font-medium">
          Cég
        </label>
        <input
          id="company"
          name="company"
          className="rounded-lg border border-paper-3 bg-white px-3 py-2 text-sm outline-none focus:border-brook"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="rounded-lg border border-paper-3 bg-white px-3 py-2 text-sm outline-none focus:border-brook"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium">
          Üzenet / megjegyzés
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          className="rounded-lg border border-paper-3 bg-white px-3 py-2 text-sm outline-none focus:border-brook"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="ownerId" className="text-sm font-medium">
          Felelős sales rep
        </label>
        <select
          id="ownerId"
          name="ownerId"
          defaultValue=""
          className="rounded-lg border border-paper-3 bg-white px-3 py-2 text-sm outline-none focus:border-brook"
        >
          <option value="">Én (alapértelmezett)</option>
          {profiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="locale" className="text-sm font-medium">
          Nyelv
        </label>
        <select
          id="locale"
          name="locale"
          defaultValue="hu"
          className="rounded-lg border border-paper-3 bg-white px-3 py-2 text-sm outline-none focus:border-brook"
        >
          <option value="hu">Magyar</option>
          <option value="en">Angol</option>
        </select>
        <p className="text-xs text-ink/50">
          Ezen a nyelven kapja a lead a kérdőív-/foglalás-linkeket és a
          tranzakciós emaileket (a foglalás/kérdőív oldalon a látogató ettől
          függetlenül át tud váltani).
        </p>
      </div>
      {state?.error && <FormMessage type="error">{state.error}</FormMessage>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-gradient-brand mt-2 self-start rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {isPending ? "Mentés..." : "Lead létrehozása"}
      </button>
    </form>
  );
}
