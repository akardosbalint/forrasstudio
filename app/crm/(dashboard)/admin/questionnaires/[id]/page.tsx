import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { deleteQuestion, moveQuestion } from "../actions";
import { AddQuestionForm } from "./AddQuestionForm";

const TYPE_LABELS: Record<string, string> = {
  TEXT: "Rövid szöveg",
  TEXTAREA: "Hosszú szöveg",
  NUMBER: "Szám",
  SELECT: "Legördülő",
  MULTISELECT: "Jelölőnégyzetek",
  BOOLEAN: "Igen/Nem",
  DATE: "Dátum",
};

export default async function QuestionnaireTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("ADMIN");
  const { id } = await params;

  const template = await prisma.questionnaireTemplate.findUnique({
    where: { id },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  if (!template) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">
          {template.name}
        </h1>
        <p className="text-sm text-ink/50">
          {template.isActive ? "Aktív sablon" : "Nem aktív"}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {template.questions.map((question, index) => (
          <div
            key={question.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-paper-3 bg-white p-4"
          >
            <div>
              <p className="text-sm font-medium">{question.label}</p>
              <p className="text-xs text-ink/50">
                {TYPE_LABELS[question.type]}
                {question.required ? " · kötelező" : " · opcionális"}
                {Array.isArray(question.options) && question.options.length > 0
                  ? ` · ${(question.options as string[]).join(", ")}`
                  : ""}
              </p>
              {question.helpText && (
                <p className="text-xs text-ink/40">{question.helpText}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <form action={moveQuestion}>
                <input type="hidden" name="id" value={question.id} />
                <input type="hidden" name="templateId" value={template.id} />
                <input type="hidden" name="direction" value="up" />
                <button
                  type="submit"
                  disabled={index === 0}
                  className="rounded border border-paper-3 px-2 py-1 text-xs disabled:opacity-30"
                >
                  ↑
                </button>
              </form>
              <form action={moveQuestion}>
                <input type="hidden" name="id" value={question.id} />
                <input type="hidden" name="templateId" value={template.id} />
                <input type="hidden" name="direction" value="down" />
                <button
                  type="submit"
                  disabled={index === template.questions.length - 1}
                  className="rounded border border-paper-3 px-2 py-1 text-xs disabled:opacity-30"
                >
                  ↓
                </button>
              </form>
              <form action={deleteQuestion}>
                <input type="hidden" name="id" value={question.id} />
                <input type="hidden" name="templateId" value={template.id} />
                <button
                  type="submit"
                  className="rounded border border-red-200 px-2 py-1 text-xs text-red-600"
                >
                  Törlés
                </button>
              </form>
            </div>
          </div>
        ))}
        {template.questions.length === 0 && (
          <p className="text-sm text-ink/50">Még nincs kérdés a sablonban.</p>
        )}
      </div>

      <AddQuestionForm templateId={template.id} />
    </div>
  );
}
