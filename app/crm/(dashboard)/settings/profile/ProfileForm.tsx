"use client";

import { useActionState } from "react";
import { updateProfileName, type UpdateProfileNameState } from "./actions";
import { FormMessage } from "../../FormMessage";

export function ProfileForm({ currentName }: { currentName: string }) {
  const [state, formAction, isPending] = useActionState<
    UpdateProfileNameState,
    FormData
  >(updateProfileName, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Név
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={currentName}
          className="w-full max-w-sm rounded-lg border border-paper-3 bg-white px-3 py-2 text-sm outline-none focus:border-brook"
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper disabled:opacity-60"
        >
          {isPending ? "Mentés..." : "Mentés"}
        </button>
      </div>
      {state?.error && <FormMessage type="error">{state.error}</FormMessage>}
    </form>
  );
}
