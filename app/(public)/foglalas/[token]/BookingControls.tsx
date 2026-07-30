"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelBookingPublic } from "./actions";
import { SlotPicker } from "./SlotPicker";

export function BookingControls({
  token,
  bookingId,
  rescheduleSlots,
}: {
  token: string;
  bookingId: string;
  rescheduleSlots: string[];
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"idle" | "reschedule">("idle");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCancel() {
    setError(null);
    startTransition(async () => {
      const result = await cancelBookingPublic(token, bookingId);
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
          slots={rescheduleSlots}
          mode="reschedule"
          bookingId={bookingId}
          onSuccess={() => setMode("idle")}
        />
        <button
          type="button"
          onClick={() => setMode("idle")}
          className="self-start text-sm text-ink/50 underline"
        >
          Mégsem
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
          Átütemezés
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={handleCancel}
          className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 disabled:opacity-60"
        >
          {isPending ? "Lemondás..." : "Lemondás"}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
