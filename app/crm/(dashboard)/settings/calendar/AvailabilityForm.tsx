"use client";

import { useActionState } from "react";
import {
  saveRepAvailability,
  type SaveAvailabilityState,
} from "./actions";
import type { RepAvailability } from "@/generated/prisma/client";

const WEEKDAY_LABELS: Record<number, string> = {
  1: "Hétfő",
  2: "Kedd",
  3: "Szerda",
  4: "Csütörtök",
  5: "Péntek",
};

export function AvailabilityForm({
  availability,
}: {
  availability: RepAvailability[];
}) {
  const [state, formAction, isPending] = useActionState<
    SaveAvailabilityState,
    FormData
  >(saveRepAvailability, undefined);

  const availabilityByWeekday = new Map(
    availability.map((row) => [row.weekday, row]),
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {[1, 2, 3, 4, 5].map((weekday) => {
        const existing = availabilityByWeekday.get(weekday);
        return (
          <div key={weekday} className="flex items-center gap-3 text-sm">
            <label className="flex w-28 items-center gap-2">
              <input
                type="checkbox"
                name={`enabled-${weekday}`}
                defaultChecked={!!existing}
              />
              {WEEKDAY_LABELS[weekday]}
            </label>
            <input
              type="time"
              name={`start-${weekday}`}
              defaultValue={existing?.startTime ?? "09:00"}
              min="09:00"
              max="18:00"
              className="rounded-lg border border-paper-3 bg-white px-2 py-1"
            />
            <span className="text-ink/40">–</span>
            <input
              type="time"
              name={`end-${weekday}`}
              defaultValue={existing?.endTime ?? "18:00"}
              min="09:00"
              max="18:00"
              className="rounded-lg border border-paper-3 bg-white px-2 py-1"
            />
          </div>
        );
      })}
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-green-700">Elérhetőség elmentve.</p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="mt-2 self-start rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper disabled:opacity-60"
      >
        {isPending ? "Mentés..." : "Mentés"}
      </button>
    </form>
  );
}
