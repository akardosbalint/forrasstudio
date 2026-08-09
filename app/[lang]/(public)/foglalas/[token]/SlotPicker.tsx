"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import type { BookingSlotPickerDict } from "@/dictionaries/flows/types";
import {
  createBookingPublic,
  rescheduleBookingPublic,
} from "./actions";

export function SlotPicker({
  token,
  lang,
  slots,
  mode,
  bookingId,
  onSuccess,
  dict,
}: {
  token: string;
  lang: Locale;
  slots: string[];
  mode: "book" | "reschedule";
  bookingId?: string;
  onSuccess?: () => void;
  dict: BookingSlotPickerDict;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const groupedByDay = useMemo(() => {
    const groups = new Map<string, string[]>();
    for (const iso of slots) {
      const date = new Date(iso);
      const dayKey = date.toLocaleDateString(lang === "en" ? "en-US" : "hu-HU", {
        timeZone: "Europe/Budapest",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const list = groups.get(dayKey) ?? [];
      list.push(iso);
      groups.set(dayKey, list);
    }
    return Array.from(groups.entries());
  }, [slots, lang]);

  function handleConfirm() {
    if (!selected) return;
    setError(null);
    startTransition(async () => {
      const result =
        mode === "reschedule" && bookingId
          ? await rescheduleBookingPublic(lang, token, bookingId, selected)
          : await createBookingPublic(lang, token, selected);

      if (result?.error) {
        setError(result.error);
        return;
      }
      onSuccess?.();
      router.refresh();
    });
  }

  if (slots.length === 0) {
    return <p className="text-sm text-ink/60">{dict.empty}</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex max-h-96 flex-col gap-4 overflow-y-auto">
        {groupedByDay.map(([day, times]) => (
          <div key={day}>
            <p className="mb-2 text-sm font-medium text-ink/70">{day}</p>
            <div className="flex flex-wrap gap-2">
              {times.map((iso) => (
                <button
                  key={iso}
                  type="button"
                  onClick={() => setSelected(iso)}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    selected === iso
                      ? "border-ink bg-ink text-paper"
                      : "border-paper-3 bg-white text-ink hover:border-ink/40"
                  }`}
                >
                  {new Date(iso).toLocaleTimeString(
                    lang === "en" ? "en-US" : "hu-HU",
                    {
                      timeZone: "Europe/Budapest",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="button"
        disabled={!selected || isPending}
        onClick={handleConfirm}
        className="self-start rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-paper disabled:opacity-60"
      >
        {isPending
          ? dict.confirmPending
          : mode === "reschedule"
            ? dict.confirmReschedule
            : dict.confirmBooking}
      </button>
    </div>
  );
}
