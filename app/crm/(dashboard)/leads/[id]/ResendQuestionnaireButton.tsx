"use client";

import { useActionState } from "react";
import {
  resendQuestionnaireInvite,
  type ResendQuestionnaireState,
} from "../actions";
import { FormMessage } from "../../FormMessage";

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
      {state?.error && <FormMessage type="error">{state.error}</FormMessage>}
      {state?.warning && (
        <FormMessage type="warning">{state.warning}</FormMessage>
      )}
      {state?.success && (
        <FormMessage type="success">Új link kiküldve.</FormMessage>
      )}
    </form>
  );
}
