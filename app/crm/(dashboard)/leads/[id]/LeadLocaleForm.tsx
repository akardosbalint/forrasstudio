"use client";

import { useActionState } from "react";
import {
  updateLeadLocale,
  type UpdateLeadLocaleState,
} from "../actions";

export function LeadLocaleForm({
  leadId,
  locale,
}: {
  leadId: string;
  locale: string;
}) {
  const [state, formAction, isPending] = useActionState<
    UpdateLeadLocaleState,
    FormData
  >(updateLeadLocale, undefined);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="leadId" value={leadId} />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="locale" className="text-sm font-medium">
          Nyelv
        </label>
        <select
          id="locale"
          name="locale"
          defaultValue={locale}
          className="w-40 rounded-lg border border-paper-3 bg-white px-3 py-2 text-sm outline-none focus:border-brook"
        >
          <option value="hu">Magyar</option>
          <option value="en">Angol</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper disabled:opacity-60"
      >
        {isPending ? "Mentés..." : "Mentés"}
      </button>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
