"use client";

import { useActionState } from "react";
import {
  updateLeadFinancials,
  type UpdateFinancialsState,
} from "../actions";

export function FinancialsForm({
  leadId,
  dealValueCents,
  cashCollectedCents,
}: {
  leadId: string;
  dealValueCents: number | null;
  cashCollectedCents: number | null;
}) {
  const [state, formAction, isPending] = useActionState<
    UpdateFinancialsState,
    FormData
  >(updateLeadFinancials, undefined);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="leadId" value={leadId} />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="dealValueHuf" className="text-sm font-medium">
          Ajánlat / TCV (Ft)
        </label>
        <input
          id="dealValueHuf"
          name="dealValueHuf"
          type="number"
          step="1"
          defaultValue={dealValueCents != null ? dealValueCents / 100 : ""}
          className="w-40 rounded-lg border border-paper-3 bg-white px-3 py-2 text-sm outline-none focus:border-brook"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="cashCollectedHuf" className="text-sm font-medium">
          Cash collected (Ft)
        </label>
        <input
          id="cashCollectedHuf"
          name="cashCollectedHuf"
          type="number"
          step="1"
          defaultValue={
            cashCollectedCents != null ? cashCollectedCents / 100 : ""
          }
          className="w-40 rounded-lg border border-paper-3 bg-white px-3 py-2 text-sm outline-none focus:border-brook"
        />
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
