"use client";

import { useActionState } from "react";
import { createStage, type FormState } from "./actions";
import { FormMessage } from "../../FormMessage";

export function CreateStageForm() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    createStage,
    undefined,
  );

  return (
    <form action={formAction} className="flex items-end gap-3 rounded-xl border border-dashed border-amber/30 p-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="label" className="text-sm font-medium">
          Új stádium neve
        </label>
        <input
          id="label"
          name="label"
          required
          className="rounded-lg border border-paper-3 bg-white px-3 py-2 text-sm outline-none focus:border-brook"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="color" className="text-sm font-medium">
          Szín
        </label>
        <input
          id="color"
          name="color"
          type="color"
          defaultValue="#8b5cf6"
          className="h-9 w-12 rounded"
        />
      </div>
      <label className="flex items-center gap-2 pb-2 text-sm">
        <input type="checkbox" name="isTerminal" />
        Záró stádium (pl. Nyert/Elveszett-szerű)
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper disabled:opacity-60"
      >
        {isPending ? "Létrehozás..." : "+ Stádium hozzáadása"}
      </button>
      {state?.error && <FormMessage type="error">{state.error}</FormMessage>}
    </form>
  );
}
