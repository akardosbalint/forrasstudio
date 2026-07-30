"use client";

import { useActionState } from "react";
import { updateEmailTemplate, type FormState } from "../actions";

export function EditTemplateForm({
  templateKey,
  subject,
  bodyHtml,
  bodyText,
}: {
  templateKey: string;
  subject: string;
  bodyHtml: string;
  bodyText: string;
}) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    updateEmailTemplate,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="key" value={templateKey} />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="subject" className="text-sm font-medium">
          Tárgy
        </label>
        <input
          id="subject"
          name="subject"
          defaultValue={subject}
          required
          className="rounded-lg border border-paper-3 bg-white px-3 py-2 text-sm outline-none focus:border-brook"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="bodyHtml" className="text-sm font-medium">
          Törzs (HTML)
        </label>
        <textarea
          id="bodyHtml"
          name="bodyHtml"
          defaultValue={bodyHtml}
          rows={8}
          required
          className="rounded-lg border border-paper-3 bg-white px-3 py-2 font-mono text-xs outline-none focus:border-brook"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="bodyText" className="text-sm font-medium">
          Törzs (sima szöveg)
        </label>
        <textarea
          id="bodyText"
          name="bodyText"
          defaultValue={bodyText}
          rows={6}
          required
          className="rounded-lg border border-paper-3 bg-white px-3 py-2 font-mono text-xs outline-none focus:border-brook"
        />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-green-700">Mentve.</p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper disabled:opacity-60"
      >
        {isPending ? "Mentés..." : "Mentés"}
      </button>
    </form>
  );
}
