import type { QuestionnaireQuestion } from "@/generated/prisma/client";

export type AnswerValue = string | number | boolean | string[];
export type Answers = Record<string, AnswerValue>;

export function questionFieldName(questionId: string): string {
  return `question-${questionId}`;
}

function parseOptions(options: unknown): string[] {
  if (!Array.isArray(options)) return [];
  return options.filter((o): o is string => typeof o === "string");
}

// Szerveroldali, tekintélyi (authoritative) validáció — a kliens oldali
// form csak UX kényelem, a tényleges kötelező-mező és típus-ellenőrzés
// mindig itt fut, a DB-ből frissen betöltött kérdéslista alapján (nem
// bízunk semmilyen kliensről érkező struktúrában).
export function parseAndValidateAnswers(
  questions: QuestionnaireQuestion[],
  formData: FormData,
): { answers: Answers } | { error: string } {
  const answers: Answers = {};

  for (const question of questions) {
    const fieldName = questionFieldName(question.id);

    if (question.type === "MULTISELECT") {
      const values = formData
        .getAll(fieldName)
        .filter((v): v is string => typeof v === "string" && v.length > 0);
      if (question.required && values.length === 0) {
        return { error: `"${question.label}" megválaszolása kötelező.` };
      }
      const allowed = parseOptions(question.options);
      const invalid = values.some((v) => !allowed.includes(v));
      if (invalid) {
        return { error: `Érvénytelen válasz: "${question.label}".` };
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
      return { error: `"${question.label}" megválaszolása kötelező.` };
    }

    if (!value) continue;

    if (question.type === "NUMBER") {
      const num = Number(value);
      if (Number.isNaN(num)) {
        return { error: `"${question.label}" egy szám kell legyen.` };
      }
      answers[question.id] = num;
      continue;
    }

    if (question.type === "SELECT") {
      const allowed = parseOptions(question.options);
      if (!allowed.includes(value)) {
        return { error: `Érvénytelen válasz: "${question.label}".` };
      }
      answers[question.id] = value;
      continue;
    }

    answers[question.id] = value;
  }

  return { answers };
}
