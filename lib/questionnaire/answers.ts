import type { QuestionnaireQuestion } from "@/generated/prisma/client";
import type { Locale } from "@/lib/i18n/config";
import { flows as flowsHu } from "@/dictionaries/flows/hu";
import { flows as flowsEn } from "@/dictionaries/flows/en";

const flowsByLocale = { hu: flowsHu, en: flowsEn } as const;

export type AnswerValue = string | number | boolean | string[];
export type Answers = Record<string, AnswerValue>;

export function questionFieldName(questionId: string): string {
  return `question-${questionId}`;
}

function parseOptions(options: unknown): string[] {
  if (!Array.isArray(options)) return [];
  return options.filter((o): o is string => typeof o === "string");
}

function localizedLabel(question: QuestionnaireQuestion, locale: Locale): string {
  return locale === "en"
    ? (question.labelEn ?? question.label)
    : question.label;
}

function localizedOptionsFor(
  question: QuestionnaireQuestion,
  locale: Locale,
): string[] {
  const options =
    locale === "en" ? (question.optionsEn ?? question.options) : question.options;
  return parseOptions(options);
}

// Szerveroldali, tekintélyi (authoritative) validáció — a kliens oldali
// form csak UX kényelem, a tényleges kötelező-mező és típus-ellenőrzés
// mindig itt fut, a DB-ből frissen betöltött kérdéslista alapján (nem
// bízunk semmilyen kliensről érkező struktúrában). A hibaüzenetek a
// `locale` szerint (hu/en) lokalizáltak — a mondat körüli sablon a
// `flows` szótárból jön, a kérdés címkéje (`label`) pedig már eleve a
// megfelelő nyelvű (labelEn fallback hu-ra, ha nincs fordítás).
export function parseAndValidateAnswers(
  questions: QuestionnaireQuestion[],
  formData: FormData,
  locale: Locale,
): { answers: Answers } | { error: string } {
  const answers: Answers = {};
  const t = flowsByLocale[locale].questionnaire.validation;

  for (const question of questions) {
    const fieldName = questionFieldName(question.id);
    const label = localizedLabel(question, locale);

    if (question.type === "MULTISELECT") {
      const values = formData
        .getAll(fieldName)
        .filter((v): v is string => typeof v === "string" && v.length > 0);
      if (question.required && values.length === 0) {
        return { error: t.required(label) };
      }
      const allowed = localizedOptionsFor(question, locale);
      const invalid = values.some((v) => !allowed.includes(v));
      if (invalid) {
        return { error: t.invalidOption(label) };
      }
      if (values.length > 0) answers[question.id] = values;
      continue;
    }

    if (question.type === "BOOLEAN") {
      answers[question.id] = formData.get(fieldName) === "on";
      continue;
    }

    const raw = formData.get(fieldName);
    const value = typeof raw === "string" ? raw.trim() : "";

    if (question.required && !value) {
      return { error: t.required(label) };
    }

    if (!value) continue;

    if (question.type === "NUMBER") {
      const num = Number(value);
      if (Number.isNaN(num)) {
        return { error: t.mustBeNumber(label) };
      }
      answers[question.id] = num;
      continue;
    }

    if (question.type === "SELECT") {
      const allowed = localizedOptionsFor(question, locale);
      if (!allowed.includes(value)) {
        return { error: t.invalidOption(label) };
      }
      answers[question.id] = value;
      continue;
    }

    answers[question.id] = value;
  }

  return { answers };
}
