"use client";

import { useActionState, useState } from "react";
import { addQuestion, type FormState } from "../actions";

const TYPE_LABELS: Record<string, string> = {
  TEXT: "Rövid szöveg",
  TEXTAREA: "Hosszú szöveg",
  NUMBER: "Szám",
  SELECT: "Legördülő (egy válasz)",
  MULTISELECT: "Jelölőnégyzetek (több válasz)",
  BOOLEAN: "Igen/Nem",
  DATE: "Dátum",
};

export function AddQuestionForm({ templateId }: { templateId: string }) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    addQuestion,
    undefined,
  );
  const [type, setType] = useState("TEXT");
  const needsOptions = type === "SELECT" || type === "MULTISELECT";

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 rounded-xl border border-dashed border-paper-3 p-4"
    >
      <input type="hidden" name="templateId" value={templateId} />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="label" className="text-sm font-medium">
          Kérdés szövege
        </label>
        <input
          id="label"
          name="label"
          required
          className="rounded-lg border border-paper-3 bg-white px-3 py-2 text-sm outline-none focus:border-brook"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="helpText" className="text-sm font-medium">
          Segítő szöveg (opcionális)
        </label>
        <input
          id="helpText"
          name="helpText"
          className="rounded-lg border border-paper-3 bg-white px-3 py-2 text-sm outline-none focus:border-brook"
        />
      </div>
      <div className="flex flex-col gap-1.5 border-t border-dashed border-paper-3 pt-3">
        <label htmlFor="labelEn" className="text-sm font-medium">
          Kérdés szövege — angolul (opcionális)
        </label>
        <input
          id="labelEn"
          name="labelEn"
          placeholder="Ha üres, a publikus angol kérdőív-oldalon is a magyar szöveg jelenik meg."
          className="rounded-lg border border-paper-3 bg-white px-3 py-2 text-sm outline-none focus:border-brook"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="helpTextEn" className="text-sm font-medium">
          Segítő szöveg — angolul (opcionális)
        </label>
        <input
          id="helpTextEn"
          name="helpTextEn"
          className="rounded-lg border border-paper-3 bg-white px-3 py-2 text-sm outline-none focus:border-brook"
        />
      </div>
      <div className="flex gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="type" className="text-sm font-medium">
            Típus
          </label>
          <select
            id="type"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-lg border border-paper-3 bg-white px-3 py-2 text-sm outline-none focus:border-brook"
          >
            {Object.entries(TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2 self-end pb-2 text-sm">
          <input type="checkbox" name="required" defaultChecked />
          Kötelező
        </label>
      </div>
      {needsOptions && (
        <>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="options" className="text-sm font-medium">
              Opciók (vesszővel elválasztva)
            </label>
            <input
              id="options"
              name="options"
              placeholder="Opció 1, Opció 2, Opció 3"
              className="rounded-lg border border-paper-3 bg-white px-3 py-2 text-sm outline-none focus:border-brook"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="optionsEn" className="text-sm font-medium">
              Opciók — angolul (opcionális, vesszővel elválasztva, azonos
              sorrendben)
            </label>
            <input
              id="optionsEn"
              name="optionsEn"
              placeholder="Option 1, Option 2, Option 3"
              className="rounded-lg border border-paper-3 bg-white px-3 py-2 text-sm outline-none focus:border-brook"
            />
          </div>
        </>
      )}
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper disabled:opacity-60"
      >
        {isPending ? "Hozzáadás..." : "+ Kérdés hozzáadása"}
      </button>
    </form>
  );
}
