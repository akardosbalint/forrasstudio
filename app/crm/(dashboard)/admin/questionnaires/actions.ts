"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/rbac";
import { writeAuditLog } from "@/lib/audit/log";
import type { QuestionType } from "@/generated/prisma/client";

const QUESTION_TYPES: QuestionType[] = [
  "TEXT",
  "TEXTAREA",
  "NUMBER",
  "SELECT",
  "MULTISELECT",
  "BOOLEAN",
  "DATE",
];

export type FormState = { error?: string } | undefined;

export async function createTemplate(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const { profile } = await requireRole("ADMIN");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "A név megadása kötelező." };

  const template = await prisma.questionnaireTemplate.create({
    data: { name, isActive: false },
  });

  await writeAuditLog({
    userId: profile.id,
    entityType: "QuestionnaireTemplate",
    entityId: template.id,
    action: "questionnaire_template.created",
  });

  revalidatePath("/crm/admin/questionnaires");
  redirect(`/crm/admin/questionnaires/${template.id}`);
}

export async function setActiveTemplate(formData: FormData): Promise<void> {
  const { profile } = await requireRole("ADMIN");
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.$transaction([
    prisma.questionnaireTemplate.updateMany({
      data: { isActive: false },
      where: { isActive: true },
    }),
    prisma.questionnaireTemplate.update({
      where: { id },
      data: { isActive: true },
    }),
  ]);

  await writeAuditLog({
    userId: profile.id,
    entityType: "QuestionnaireTemplate",
    entityId: id,
    action: "questionnaire_template.activated",
  });

  revalidatePath("/crm/admin/questionnaires");
}

export async function deleteTemplate(formData: FormData): Promise<void> {
  const { profile } = await requireRole("ADMIN");
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  try {
    await prisma.questionnaireTemplate.delete({ where: { id } });
  } catch {
    // Foreign key constraint — a sablont már használta legalább egy lead.
    return;
  }

  await writeAuditLog({
    userId: profile.id,
    entityType: "QuestionnaireTemplate",
    entityId: id,
    action: "questionnaire_template.deleted",
  });

  revalidatePath("/crm/admin/questionnaires");
}

function parseOptions(raw: FormDataEntryValue | null): string[] | undefined {
  const value = typeof raw === "string" ? raw.trim() : "";
  if (!value) return undefined;
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function addQuestion(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const { profile } = await requireRole("ADMIN");
  const templateId = String(formData.get("templateId") ?? "");
  const label = String(formData.get("label") ?? "").trim();
  const type = String(formData.get("type") ?? "TEXT") as QuestionType;
  const helpText = String(formData.get("helpText") ?? "").trim();
  const labelEn = String(formData.get("labelEn") ?? "").trim();
  const helpTextEn = String(formData.get("helpTextEn") ?? "").trim();
  const required = formData.get("required") === "on";
  const options = parseOptions(formData.get("options"));
  const optionsEn = parseOptions(formData.get("optionsEn"));

  if (!templateId || !label) {
    return { error: "A kérdés szövege kötelező." };
  }
  if (!QUESTION_TYPES.includes(type)) {
    return { error: "Érvénytelen kérdéstípus." };
  }
  if ((type === "SELECT" || type === "MULTISELECT") && !options?.length) {
    return { error: "SELECT/MULTISELECT típushoz legalább egy opció kell (vesszővel elválasztva)." };
  }

  const maxOrder = await prisma.questionnaireQuestion.aggregate({
    where: { templateId },
    _max: { order: true },
  });

  const question = await prisma.questionnaireQuestion.create({
    data: {
      templateId,
      label,
      helpText: helpText || null,
      labelEn: labelEn || null,
      helpTextEn: helpTextEn || null,
      type,
      required,
      options,
      optionsEn: optionsEn ?? undefined,
      order: (maxOrder._max.order ?? 0) + 1,
    },
  });

  await writeAuditLog({
    userId: profile.id,
    entityType: "QuestionnaireQuestion",
    entityId: question.id,
    action: "questionnaire_question.created",
    metadata: { templateId },
  });

  revalidatePath(`/crm/admin/questionnaires/${templateId}`);
  return undefined;
}

export async function deleteQuestion(formData: FormData): Promise<void> {
  const { profile } = await requireRole("ADMIN");
  const id = String(formData.get("id") ?? "");
  const templateId = String(formData.get("templateId") ?? "");
  if (!id) return;

  await prisma.questionnaireQuestion.delete({ where: { id } });

  await writeAuditLog({
    userId: profile.id,
    entityType: "QuestionnaireQuestion",
    entityId: id,
    action: "questionnaire_question.deleted",
  });

  revalidatePath(`/crm/admin/questionnaires/${templateId}`);
}

export async function moveQuestion(formData: FormData): Promise<void> {
  const { profile } = await requireRole("ADMIN");
  const id = String(formData.get("id") ?? "");
  const templateId = String(formData.get("templateId") ?? "");
  const direction = String(formData.get("direction") ?? "");
  if (!id || !templateId) return;

  const questions = await prisma.questionnaireQuestion.findMany({
    where: { templateId },
    orderBy: { order: "asc" },
  });
  const index = questions.findIndex((q) => q.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= questions.length) return;

  const current = questions[index];
  const swapWith = questions[swapIndex];

  await prisma.$transaction([
    prisma.questionnaireQuestion.update({
      where: { id: current.id },
      data: { order: swapWith.order },
    }),
    prisma.questionnaireQuestion.update({
      where: { id: swapWith.id },
      data: { order: current.order },
    }),
  ]);

  await writeAuditLog({
    userId: profile.id,
    entityType: "QuestionnaireQuestion",
    entityId: id,
    action: "questionnaire_question.reordered",
  });

  revalidatePath(`/crm/admin/questionnaires/${templateId}`);
}
