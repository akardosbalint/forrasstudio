"use server";

import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit/log";
import { parseAndValidateAnswers } from "@/lib/questionnaire/answers";
import { SYSTEM_STAGE_KEYS } from "@/lib/pipeline/stages";
import { renderEmailTemplate } from "@/lib/email/templates";
import { sendTransactionalEmail } from "@/lib/email/smtp";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/dictionaries";

export type SubmitQuestionnaireState =
  | { error?: string; success?: boolean }
  | undefined;

// A `message` (második paraméter) csak hibakeresési/log célt szolgál —
// a látogatónak megjelenő szöveg mindig a `code`-on keresztül, a `flows`
// szótárból származik (lásd lent).
class QuestionnaireSubmitError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export async function submitQuestionnaireResponse(
  _prevState: SubmitQuestionnaireState,
  formData: FormData,
): Promise<SubmitQuestionnaireState> {
  // A `lang` a form egy rejtett mezőjeként érkezik (lásd QuestionnaireForm.tsx)
  // — ugyanaz a minta, mint a `token` mezőé, mivel a `useActionState`
  // action-je fix (prevState, formData) szignatúrájú.
  const langRaw = String(formData.get("lang") ?? "");
  const lang: Locale = isLocale(langRaw) ? langRaw : defaultLocale;
  const dict = await getDictionary(lang);
  const errors = dict.flows.questionnaire.errors;

  const token = String(formData.get("token") ?? "");
  if (!token) {
    return { error: errors.MISSING_TOKEN };
  }

  const link = await prisma.questionnaireLink.findUnique({
    where: { token },
    include: {
      template: { include: { questions: { orderBy: { order: "asc" } } } },
    },
  });

  if (!link) {
    return { error: errors.INVALID_LINK };
  }
  if (link.expiresAt < new Date()) {
    return { error: errors.LINK_EXPIRED };
  }
  if (link.usedAt) {
    return { error: errors.ALREADY_SUBMITTED };
  }

  const result = parseAndValidateAnswers(link.template.questions, formData, lang);
  if ("error" in result) {
    return { error: result.error };
  }

  const bookingPendingStage = await prisma.pipelineStage.findUnique({
    where: { key: SYSTEM_STAGE_KEYS.BOOKING_PENDING },
  });
  if (!bookingPendingStage) {
    return { error: errors.MISSING_STAGE };
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
        throw new QuestionnaireSubmitError("LEAD_NOT_FOUND", "A lead nem található.");
      }
      if (freshLead.currentStage.key !== SYSTEM_STAGE_KEYS.QUESTIONNAIRE_SENDING) {
        throw new QuestionnaireSubmitError(
          "STAGE_CHANGED",
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
        throw new QuestionnaireSubmitError(
          "ALREADY_SUBMITTED",
          "Ezt a kérdőívet már kitöltötted.",
        );
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
    const code =
      error instanceof QuestionnaireSubmitError ? error.code : "UNKNOWN";
    return {
      error: errors[code as keyof typeof errors] ?? errors.UNKNOWN,
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
    const bookingUrl = `${(process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "")}/${lang}/foglalas/${token}`;
    const email = await renderEmailTemplate("questionnaire_submitted", lang, {
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
