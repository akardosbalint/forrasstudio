"use client";

import { useActionState } from "react";
import { changeLeadStage, type ChangeLeadStageState } from "../actions";
import type { PipelineStage } from "@/generated/prisma/client";

export function StageChangeForm({
  leadId,
  currentStageId,
  stages,
}: {
  leadId: string;
  currentStageId: string;
  stages: PipelineStage[];
}) {
  const [state, formAction, isPending] = useActionState<
    ChangeLeadStageState,
    FormData
  >(changeLeadStage, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end gap-3">
        <input type="hidden" name="leadId" value={leadId} />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="toStageId" className="text-sm font-medium">
            Stádium
          </label>
          <select
            id="toStageId"
            name="toStageId"
            defaultValue={currentStageId}
            className="rounded-lg border border-paper-3 bg-white px-3 py-2 text-sm outline-none focus:border-brook"
          >
            {stages.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="note" className="text-sm font-medium">
            Megjegyzés (opcionális)
          </label>
          <input
            id="note"
            name="note"
            className="rounded-lg border border-paper-3 bg-white px-3 py-2 text-sm outline-none focus:border-brook"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper disabled:opacity-60"
        >
          {isPending ? "Frissítés..." : "Státusz frissítése"}
        </button>
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.warning && (
        <p className="text-sm text-amber-600">{state.warning}</p>
      )}
    </form>
  );
}
