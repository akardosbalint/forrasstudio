"use client";

import { useRef } from "react";
import { changeLeadStage } from "../actions";
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
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={changeLeadStage}
      className="flex flex-wrap items-end gap-3"
    >
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
        className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper"
      >
        Státusz frissítése
      </button>
    </form>
  );
}
