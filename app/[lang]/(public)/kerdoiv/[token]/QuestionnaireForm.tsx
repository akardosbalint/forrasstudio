"use client";

import { useActionState } from "react";
import {
  submitQuestionnaireResponse,
  type SubmitQuestionnaireState,
} from "./actions";
import { questionFieldName } from "@/lib/questionnaire/answers";
import type { QuestionnaireQuestion } from "@/generated/prisma/client";
import type { Locale } from "@/lib/i18n/config";
import type { QuestionnaireDict } from "@/dictionaries/flows/types";

function parseOptions(options: unknown): string[] {
  if (!Array.isArray(options)) return [];
  return options.filter((o): o is string => typeof o === "string");
}

function questionLabel(question: QuestionnaireQuestion, lang: Locale): string {
  return lang === "en" ? question.labelEn ?? question.label : question.label;
}

function questionHelpText(
  question: QuestionnaireQuestion,
  lang: Locale,
): string | null {
  return lang === "en"
    ? question.helpTextEn ?? question.helpText
    : question.helpText;
}

function questionOptions(question: QuestionnaireQuestion, lang: Locale): string[] {
  const raw =
    lang === "en"
      ? (question.optionsEn as string[] | null) ?? (question.options as string[])
      : question.options;
  return parseOptions(raw);
}

function QuestionField({
  question,
  lang,
  dict,
}: {
  question: QuestionnaireQuestion;
  lang: Locale;
  dict: QuestionnaireDict;
}) {
  const name = questionFieldName(question.id);
  const baseInputClass =
    "rounded-lg border border-paper-3 bg-white px-3 py-2 text-sm outline-none focus:border-brook w-full";

  switch (question.type) {
    case "TEXTAREA":
      return (
        <textarea
          id={name}
          name={name}
          rows={4}
          required={question.required}
          className={baseInputClass}
        />
      );
    case "NUMBER":
      return (
        <input
          id={name}
          name={name}
          type="number"
          required={question.required}
          className={baseInputClass}
        />
      );
    case "DATE":
      return (
        <input
          id={name}
          name={name}
          type="date"
          required={question.required}
          className={baseInputClass}
        />
      );
    case "BOOLEAN":
      return (
        <label className="flex items-center gap-2 text-sm">
          <input id={name} name={name} type="checkbox" />
          {dict.form.booleanYes}
        </label>
      );
    case "SELECT": {
      const options = questionOptions(question, lang);
      return (
        <select
          id={name}
          name={name}
          required={question.required}
          defaultValue=""
          className={baseInputClass}
        >
          <option value="" disabled>
            {dict.form.selectPlaceholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }
    case "MULTISELECT": {
      const options = questionOptions(question, lang);
      return (
        <div className="flex flex-col gap-1.5">
          {options.map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name={name} value={option} />
              {option}
            </label>
          ))}
        </div>
      );
    }
    case "TEXT":
    default:
      return (
        <input
          id={name}
          name={name}
          type="text"
          required={question.required}
          className={baseInputClass}
        />
      );
  }
}

export function QuestionnaireForm({
  token,
  lang,
  questions,
  dict,
}: {
  token: string;
  lang: Locale;
  questions: QuestionnaireQuestion[];
  dict: QuestionnaireDict;
}) {
  const [state, formAction, isPending] = useActionState<
    SubmitQuestionnaireState,
    FormData
  >(submitQuestionnaireResponse, undefined);

  if (state?.success) {
    return (
      <div className="rounded-xl border border-paper-3 bg-white p-6 text-center">
        <h2 className="mb-2 font-display text-lg font-semibold">
          {dict.success.heading}
        </h2>
        <p className="text-sm text-ink/70">{dict.success.body}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="lang" value={lang} />
      {questions.map((question) => {
        const helpText = questionHelpText(question, lang);
        return (
          <div key={question.id} className="flex flex-col gap-1.5">
            <label
              htmlFor={questionFieldName(question.id)}
              className="text-sm font-medium"
            >
              {questionLabel(question, lang)}
              {question.required && <span className="text-red-500"> *</span>}
            </label>
            {helpText && <p className="text-xs text-ink/50">{helpText}</p>}
            <QuestionField question={question} lang={lang} dict={dict} />
          </div>
        );
      })}
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-paper disabled:opacity-60"
      >
        {isPending ? dict.form.submitting : dict.form.submit}
      </button>
    </form>
  );
}
