"use client";

import { useActionState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { flows as flowsHu } from "@/dictionaries/flows/hu";
import { flows as flowsEn } from "@/dictionaries/flows/en";
import {
  submitQuestionnaireResponse,
  type SubmitQuestionnaireState,
} from "./actions";
import { questionFieldName } from "@/lib/questionnaire/answers";
import type { QuestionnaireQuestion } from "@/generated/prisma/client";

const flowsByLocale = { hu: flowsHu, en: flowsEn } as const;

function parseOptions(options: unknown): string[] {
  if (!Array.isArray(options)) return [];
  return options.filter((o): o is string => typeof o === "string");
}

function localizedLabel(question: QuestionnaireQuestion, lang: Locale): string {
  return lang === "en" ? (question.labelEn ?? question.label) : question.label;
}

function localizedHelpText(
  question: QuestionnaireQuestion,
  lang: Locale,
): string | null {
  return lang === "en"
    ? (question.helpTextEn ?? question.helpText)
    : question.helpText;
}

function localizedOptions(question: QuestionnaireQuestion, lang: Locale): string[] {
  const options =
    lang === "en"
      ? ((question.optionsEn as string[] | null) ?? (question.options as string[] | null))
      : (question.options as string[] | null);
  return parseOptions(options);
}

function QuestionField({
  question,
  lang,
}: {
  question: QuestionnaireQuestion;
  lang: Locale;
}) {
  const name = questionFieldName(question.id);
  const t = flowsByLocale[lang].questionnaire;
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
          {t.booleanYes}
        </label>
      );
    case "SELECT": {
      const options = localizedOptions(question, lang);
      return (
        <select
          id={name}
          name={name}
          required={question.required}
          defaultValue=""
          className={baseInputClass}
        >
          <option value="" disabled>
            {t.selectPlaceholder}
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
      const options = localizedOptions(question, lang);
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
}: {
  token: string;
  lang: Locale;
  questions: QuestionnaireQuestion[];
}) {
  const t = flowsByLocale[lang].questionnaire;
  const boundSubmit = submitQuestionnaireResponse.bind(null, lang);
  const [state, formAction, isPending] = useActionState<
    SubmitQuestionnaireState,
    FormData
  >(boundSubmit, undefined);

  if (state?.success) {
    return (
      <div className="rounded-xl border border-paper-3 bg-white p-6 text-center">
        <h2 className="mb-2 font-display text-lg font-semibold">
          {t.success.heading}
        </h2>
        <p className="text-sm text-ink/70">{t.success.body}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="token" value={token} />
      {questions.map((question) => {
        const helpText = localizedHelpText(question, lang);
        return (
          <div key={question.id} className="flex flex-col gap-1.5">
            <label
              htmlFor={questionFieldName(question.id)}
              className="text-sm font-medium"
            >
              {localizedLabel(question, lang)}
              {question.required && <span className="text-red-500"> *</span>}
            </label>
            {helpText && <p className="text-xs text-ink/50">{helpText}</p>}
            <QuestionField question={question} lang={lang} />
          </div>
        );
      })}
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-paper disabled:opacity-60"
      >
        {isPending ? t.submitting : t.submit}
      </button>
    </form>
  );
}
