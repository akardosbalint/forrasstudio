"use server";

import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit/log";
import { parseAndValidateAnswers } from "@/lib/questionnaire/answers";
import { SYSTEM_STAGE_KEYS } from "@/lib/pipeline/stages";
import { renderEmailTemplate } from "@/lib/email/templates";
import { sendTransactionalEmail } from "@/lib/email/resend";

export type SubmitQuestionnaireState =
  | { error?: string; success?: boolean }
  | undefined;

export async function submitQuestionnaireResponse(
  _prevState: SubmitQuestionnaireState,
  formData: FormData,
): Promise<SubmitQuestionnaireState> {
  const token = String(formData.get("token") ?? "");
  if (!token) {
    return { error: "Hiányzó token." };
  }

  const link = await prisma.questionnaireLink.findUnique({
    where: { token },
    include: {
      lead: true,
      template: { include: { questions: { orderBy: { order: "asc" } } } },
    },
  });

  if (!link) {
    return { error: "Érvénytelen link." };
  }
  if (link.expiresAt < new Date()) {
    return { error: "Ez a link már lejárt." };
  }
  if (link.usedAt) {
    return { error: "Ezt a kérdőívet már kitöltötted." };
  }

  const result = parseAndValidateAnswers(link.template.questions, formData);
  if ("error" in result) {
    return { error: result.error };
  }

  const bookingPendingStage = await prisma.pipelineStage.findUnique({
    where: { key: SYSTEM_STAGE_KEYS.BOOKING_PENDING },
  });
  if (!bookingPendingStage) {
    return {
      error: "A rendszer nincs teljesen beüzemelve (hiányzó pipeline stádium).",
    };
  }

  const fromStageId = link.lead.currentStageId;

  await prisma.$transaction([
    prisma.questionnaireResponse.create({
      data: {
        leadId: link.leadId,
        templateId: link.templateId,
        answers: result.answers,
      },
    }),
    prisma.questionnaireLink.update({
      where: { id: link.id },
      data: { usedAt: new Date() },
    }),
    prisma.lead.update({
      where: { id: link.leadId },
      data: { currentStageId: bookingPendingStage.id },
    }),
    prisma.statusHistory.create({
      data: {
        leadId: link.leadId,
        fromStageId,
        toStageId: bookingPendingStage.id,
        changedById: null,
        note: "Kérdőív kitöltve — automatikus stádiumváltás.",
      },
    }),
  ]);

  await writeAuditLog({
    userId: null,
    entityType: "Lead",
    entityId: link.leadId,
    action: "questionnaire.submitted",
    metadata: { questionnaireLinkId: link.id },
  });

  if (link.lead.email) {
    const bookingUrl = `${(process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "")}/foglalas/${token}`;
    const email = await renderEmailTemplate("questionnaire_submitted", {
      leadName: link.lead.name,
      bookingLink: bookingUrl,
    });
    await sendTransactionalEmail({
      to: link.lead.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
    });
  }

  return { success: true };
}
