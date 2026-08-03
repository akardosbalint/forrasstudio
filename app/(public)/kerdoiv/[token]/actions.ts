"use server";

import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit/log";
import { parseAndValidateAnswers } from "@/lib/questionnaire/answers";
import { SYSTEM_STAGE_KEYS } from "@/lib/pipeline/stages";
import { renderEmailTemplate } from "@/lib/email/templates";
import { sendTransactionalEmail } from "@/lib/email/smtp";

export type SubmitQuestionnaireState =
  | { error?: string; success?: boolean }
  | undefined;

class QuestionnaireSubmitError extends Error {}

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

  let lead: { email: string | null; name: string };

  try {
    lead = await prisma.$transaction(async (tx) => {
      // A leadet és a stádiumát a tranzakción belül, frissen olvassuk —
      // nem a linkkel együtt korábban lekérdezett (esetleg azóta elavult)
      // állapotot használjuk. Ha a lead időközben továbblépett (pl. egy
      // másik, újraküldött linken keresztül már kitöltötte a kérdőívet,
      // vagy a rep kézzel máshova mozgatta), ez a régi/stale link már nem
      // regressziózhatja vissza a stádiumot.
      const freshLead = await tx.lead.findUnique({
        where: { id: link.leadId },
        include: { currentStage: true },
      });
      if (!freshLead) {
        throw new QuestionnaireSubmitError("A lead nem található.");
      }
      if (freshLead.currentStage.key !== SYSTEM_STAGE_KEYS.QUESTIONNAIRE_SENDING) {
        throw new QuestionnaireSubmitError(
          "Ez a kérdőív-link már nem aktuális — a lead státusza időközben megváltozott. Ha kérdésed van, keresd a kapcsolattartódat.",
        );
      }

      // Feltételes update: csak akkor jelöljük felhasználtnak a linket, ha
      // még tényleg felhasználatlan volt ABBAN a pillanatban — ez a
      // sorszintű zárolás miatt azonos tokenre érkező egyidejű beküldés
      // esetén is csak az egyiket engedi át (a `count` 0, ha valaki más
      // közben már felhasználta).
      const usedUpdate = await tx.questionnaireLink.updateMany({
        where: { id: link.id, usedAt: null },
        data: { usedAt: new Date() },
      });
      if (usedUpdate.count === 0) {
        throw new QuestionnaireSubmitError("Ezt a kérdőívet már kitöltötted.");
      }

      await tx.questionnaireResponse.create({
        data: {
          leadId: link.leadId,
          templateId: link.templateId,
          answers: result.answers,
        },
      });
      await tx.lead.update({
        where: { id: link.leadId },
        data: { currentStageId: bookingPendingStage.id },
      });
      await tx.statusHistory.create({
        data: {
          leadId: link.leadId,
          fromStageId: freshLead.currentStageId,
          toStageId: bookingPendingStage.id,
          changedById: null,
          note: "Kérdőív kitöltve — automatikus stádiumváltás.",
        },
      });

      return { email: freshLead.email, name: freshLead.name };
    });
  } catch (error) {
    return {
      error:
        error instanceof QuestionnaireSubmitError
          ? error.message
          : "Ismeretlen hiba történt a beküldés során. Kérjük, próbáld újra.",
    };
  }

  await writeAuditLog({
    userId: null,
    entityType: "Lead",
    entityId: link.leadId,
    action: "questionnaire.submitted",
    metadata: { questionnaireLinkId: link.id },
  });

  if (lead.email) {
    const bookingUrl = `${(process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "")}/foglalas/${token}`;
    const email = await renderEmailTemplate("questionnaire_submitted", {
      leadName: lead.name,
      bookingLink: bookingUrl,
    });
    const sendResult = await sendTransactionalEmail({
      to: lead.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
    });
    await writeAuditLog({
      userId: null,
      entityType: "Lead",
      entityId: link.leadId,
      action: "questionnaire.confirmation_email_sent",
      metadata: { emailSent: sendResult.ok, emailError: sendResult.error ?? null },
    });
  }

  return { success: true };
}
