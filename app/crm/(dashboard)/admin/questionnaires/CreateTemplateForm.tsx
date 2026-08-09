"use client";

import { useActionState } from "react";
import { createTemplate, type FormState } from "./actions";
import { FormMessage } from "../../FormMessage";

export function CreateTemplateForm() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    createTemplate,
    undefined,
  );

  return (
    <form action={formAction} className="flex items-end gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Új sablon neve
        </label>
        <input
          id="name"
          name="name"
          required
          className="rounded-lg border border-paper-3 bg-white px-3 py-2 text-sm outline-none focus:border-brook"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper disabled:opacity-60"
      >
        {isPending ? "Létrehozás..." : "Létrehozás"}
      </button>
      {state?.error && <FormMessage type="error">{state.error}</FormMessage>}
    </form>
  );
}
