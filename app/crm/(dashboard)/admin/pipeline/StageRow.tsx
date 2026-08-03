"use client";

import { useState } from "react";
import { updateStage, deleteStage, moveStage } from "./actions";
import { ConfirmSubmitButton } from "../../ConfirmSubmitButton";
import type { PipelineStage } from "@/generated/prisma/client";

export function StageRow({
  stage,
  leadCount,
  isFirst,
  isLast,
}: {
  stage: PipelineStage;
  leadCount: number;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [label, setLabel] = useState(stage.label);
  const [color, setColor] = useState(stage.color);

  return (
    <tr className="border-b border-paper-3 last:border-0 hover:bg-paper-2/40">
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <form action={moveStage}>
            <input type="hidden" name="id" value={stage.id} />
            <input type="hidden" name="direction" value="up" />
            <button
              type="submit"
              disabled={isFirst}
              className="rounded border border-paper-3 px-2 py-1 text-xs disabled:opacity-30"
            >
              ↑
            </button>
          </form>
          <form action={moveStage}>
            <input type="hidden" name="id" value={stage.id} />
            <input type="hidden" name="direction" value="down" />
            <button
              type="submit"
              disabled={isLast}
              className="rounded border border-paper-3 px-2 py-1 text-xs disabled:opacity-30"
            >
              ↓
            </button>
          </form>
        </div>
      </td>
      <td className="px-4 py-3">
        <form action={updateStage} className="flex items-center gap-2">
          <input type="hidden" name="id" value={stage.id} />
          <input
            type="color"
            name="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-8 w-8 rounded"
          />
          <input
            type="text"
            name="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="rounded-lg border border-paper-3 bg-white px-2 py-1 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg border border-paper-3 px-3 py-1 text-xs font-medium"
          >
            Mentés
          </button>
        </form>
      </td>
      <td className="px-4 py-3 text-ink/70">
        {stage.isSystem ? "Rendszer" : "Egyedi"}
        {stage.isTerminal ? " · záró" : ""}
      </td>
      <td className="px-4 py-3 text-ink/70">{leadCount}</td>
      <td className="px-4 py-3 text-right">
        {!stage.isSystem && leadCount === 0 && (
          <form action={deleteStage}>
            <input type="hidden" name="id" value={stage.id} />
            <ConfirmSubmitButton
              confirmMessage={`Biztosan törlöd a(z) "${stage.label}" stádiumot? Ez nem vonható vissza.`}
              className="text-xs font-medium text-red-600"
            >
              Törlés
            </ConfirmSubmitButton>
          </form>
        )}
      </td>
    </tr>
  );
}
