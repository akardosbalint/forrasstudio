"use client";

import { useActionState } from "react";
import {
  cancelBookingInternal,
  type CancelBookingState,
} from "../actions";

export function CancelBookingButton({
  leadId,
  bookingId,
}: {
  leadId: string;
  bookingId: string;
}) {
  const [state, formAction, isPending] = useActionState<
    CancelBookingState,
    FormData
  >(cancelBookingInternal, undefined);

  return (
    <form action={formAction} className="inline-flex flex-col gap-1">
      <input type="hidden" name="leadId" value={leadId} />
      <input type="hidden" name="bookingId" value={bookingId} />
      <button
        type="submit"
        disabled={isPending}
        onClick={(event) => {
          if (!confirm("Biztosan lemondod ezt a foglalást? A lead visszakerül \"Időpontfoglalásra vár\" státuszba, és lemondó email megy ki.")) {
            event.preventDefault();
          }
        }}
        className="rounded-lg border border-red-200 bg-white px-3 py-1 text-xs font-medium text-red-600 disabled:opacity-60"
      >
        {isPending ? "Lemondás..." : "Lemondás"}
      </button>
      {state?.error && <p className="text-xs text-red-600">{state.error}</p>}
    </form>
  );
}
