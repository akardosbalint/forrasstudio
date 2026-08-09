"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import type { BookingDict } from "@/dictionaries/flows/types";
import { cancelBookingPublic } from "./actions";
import { SlotPicker } from "./SlotPicker";

export function BookingControls({
  token,
  lang,
  bookingId,
  rescheduleSlots,
  dict,
}: {
  token: string;
  lang: Locale;
  bookingId: string;
  rescheduleSlots: string[];
  dict: BookingDict;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"idle" | "reschedule">("idle");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCancel() {
    setError(null);
    startTransition(async () => {
      const result = await cancelBookingPublic(lang, token, bookingId);
      if (result?.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  if (mode === "reschedule") {
    return (
      <div className="flex flex-col gap-4">
        <SlotPicker
          token={token}
          lang={lang}
          slots={rescheduleSlots}
          mode="reschedule"
          bookingId={bookingId}
          onSuccess={() => setMode("idle")}
          dict={dict.slotPicker}
        />
        <button
          type="button"
          onClick={() => setMode("idle")}
          className="self-start text-sm text-ink/50 underline"
        >
          {dict.controls.dismiss}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setMode("reschedule")}
          className="rounded-lg border border-paper-3 bg-white px-4 py-2 text-sm font-medium text-ink"
        >
          {dict.controls.reschedule}
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={handleCancel}
          className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 disabled:opacity-60"
        >
          {isPending ? dict.controls.cancelling : dict.controls.cancel}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
