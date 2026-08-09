import type { QuestionnaireQuestion } from "@/generated/prisma/client";
import type { Locale } from "@/lib/i18n/config";
import { flows as flowsHu } from "@/dictionaries/flows/hu";
import { flows as flowsEn } from "@/dictionaries/flows/en";

export type AnswerValue = string | number | boolean | string[];
export type Answers = Record<string, AnswerValue>;

export function questionFieldName(questionId: string): string {
  return `question-${questionId}`;
}

function parseOptions(options: unknown): string[] {
  if (!Array.isArray(options)) return [];
  return options.filter((o): o is string => typeof o === "string");
}

// Ugyanaz a `labelEn`/`optionsEn` fallback-logika, mint amit
// QuestionnaireForm.tsx a megjelenítéshez használ — a validációnak a
// látogató által ténylegesen látott (és a select/multiselect esetén
// beküldött) nyelvi változattal kell dolgoznia, különben angol UI esetén a
// magyar `options` lista ellen validálnánk egy angol értéket.
function effectiveLabel(question: QuestionnaireQuestion, locale: Locale): string {
  return locale === "en" ? question.labelEn ?? question.label : question.label;
}

function effectiveOptions(question: QuestionnaireQuestion, locale: Locale): string[] {
  const raw = locale === "en" ? question.optionsEn ?? question.options : question.options;
  return parseOptions(raw);
}

// A mondat-sablont a `locale` szerint választjuk — a `label` fenti
// `effectiveLabel` segítségével már a megfelelő nyelvű, ezt csak a
// szövegkörnyezetbe illesztjük.
function validationDict(locale: Locale) {
  return locale === "en" ? flowsEn.questionnaire.validation : flowsHu.questionnaire.validation;
}

// Szerveroldali, tekintélyi (authoritative) validáció — a kliens oldali
// form csak UX kényelem, a tényleges kötelező-mező és típus-ellenőrzés
// mindig itt fut, a DB-ből frissen betöltött kérdéslista alapján (nem
// bízunk semmilyen kliensről érkező struktúrában).
export function parseAndValidateAnswers(
  questions: QuestionnaireQuestion[],
  formData: FormData,
  locale: Locale,
): { answers: Answers } | { error: string } {
  const answers: Answers = {};
  const t = validationDict(locale);

  for (const question of questions) {
    const fieldName = questionFieldName(question.id);
    const label = effectiveLabel(question, locale);

    if (question.type === "MULTISELECT") {
      const values = formData
        .getAll(fieldName)
        .filter((v): v is string => typeof v === "string" && v.length > 0);
      if (question.required && values.length === 0) {
        return { error: t.required.replace("{{label}}", label) };
      }
      const allowed = effectiveOptions(question, locale);
      const invalid = values.some((v) => !allowed.includes(v));
      if (invalid) {
        return { error: t.invalidAnswer.replace("{{label}}", label) };
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
      return { error: t.required.replace("{{label}}", label) };
    }

    if (!value) continue;

    if (question.type === "NUMBER") {
      const num = Number(value);
      if (Number.isNaN(num)) {
        return { error: t.mustBeNumber.replace("{{label}}", label) };
      }
      answers[question.id] = num;
      continue;
    }

    if (question.type === "SELECT") {
      const allowed = effectiveOptions(question, locale);
      if (!allowed.includes(value)) {
        return { error: t.invalidAnswer.replace("{{label}}", label) };
      }
      answers[question.id] = value;
      continue;
    }

    answers[question.id] = value;
  }

  return { answers };
}
