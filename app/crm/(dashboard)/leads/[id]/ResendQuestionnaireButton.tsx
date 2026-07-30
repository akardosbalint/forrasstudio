"use client";

import { useActionState } from "react";
import {
  resendQuestionnaireInvite,
  type ResendQuestionnaireState,
} from "../actions";

export function ResendQuestionnaireButton({ leadId }: { leadId: string }) {
  const [state, formAction, isPending] = useActionState<
    ResendQuestionnaireState,
    FormData
  >(resendQuestionnaireInvite, undefined);

  return (
    <form action={formAction} className="flex flex-col items-start gap-1.5">
      <input type="hidden" name="leadId" value={leadId} />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg border border-paper-3 bg-white px-3 py-1.5 text-xs font-medium text-ink disabled:opacity-60"
      >
        {isPending ? "Küldés..." : "Kérdőív-link újraküldése"}
      </button>
      {state?.error && <p className="text-xs text-red-600">{state.error}</p>}
      {state?.warning && (
        <p className="text-xs text-amber-600">{state.warning}</p>
      )}
      {state?.success && (
        <p className="text-xs text-green-700">Új link kiküldve.</p>
      )}
    </form>
  );
}
