"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PERIODS, PERIOD_LABELS, type Period } from "@/lib/dashboard/period";
import type { Profile } from "@/generated/prisma/client";

export function DashboardFilters({
  profiles,
  sources,
  currentOwnerId,
  currentSource,
  currentPeriod,
}: {
  profiles: Profile[];
  sources: string[];
  currentOwnerId: string;
  currentSource: string;
  currentPeriod: Period;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/crm?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-ink/50">Sales rep</label>
        <select
          value={currentOwnerId}
          onChange={(e) => updateParam("ownerId", e.target.value)}
          className="rounded-lg border border-paper-3 bg-white px-3 py-2 text-sm"
        >
          <option value="">Összes</option>
          {profiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-ink/50">Forrás</label>
        <select
          value={currentSource}
          onChange={(e) => updateParam("source", e.target.value)}
          className="rounded-lg border border-paper-3 bg-white px-3 py-2 text-sm"
        >
          <option value="">Összes</option>
          {sources.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-1.5">
        {PERIODS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => updateParam("period", p)}
            className={`rounded-full border px-3 py-1.5 text-sm ${
              currentPeriod === p
                ? "border-ink bg-ink text-paper"
                : "border-paper-3 text-ink/70"
            }`}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>
    </div>
  );
}
