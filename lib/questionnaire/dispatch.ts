import "server-only";

import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit/log";
import { renderEmailTemplate } from "@/lib/email/templates";
import { sendTransactionalEmail } from "@/lib/email/smtp";
import {
  generateQuestionnaireToken,
  questionnaireLinkExpiry,
} from "@/lib/questionnaire/token";
import type { Locale } from "@/lib/i18n/config";

export class QuestionnaireDispatchError extends Error {}

function publicAppUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");
}

// A lead "Kérdőív kitöltés alatt" stádiumba lépésekor triggerelt folyamat
// (spec 3.2. pont): egyedi, lejáró tokenes link generálása + kiküldése
// emailben. A hívó (changeLeadStage action) felelős azért, hogy a lead
// stádiumváltása és ez a hívás egy logikai műveletként fusson le.
export async function triggerQuestionnaireSend(
  leadId: string,
  actingUserId: string | null,
) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) {
    throw new QuestionnaireDispatchError("A lead nem található.");
  }
  if (!lead.email) {
    throw new QuestionnaireDispatchError(
      "A leadhez nincs email cím rögzítve — a kérdőív-linket nem lehet kiküldeni.",
    );
  }

  const template = await prisma.questionnaireTemplate.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
  if (!template) {
    throw new QuestionnaireDispatchError(
      "Nincs aktív kérdőív-sablon — hozz létre egyet az admin felületen.",
    );
  }

  // Ha korábban már ment ki (fel nem használt) link ehhez a leadhez —
  // pl. újraküldés esetén —, azt lejárttá tesszük, hogy legfeljebb egy
  // élő link legyen egyszerre. Ez elsősorban UX-tisztaság (a kliens ne
  // kapjon két egyszerre érvényes linket), a tényleges biztonsági hálót a
  // beküldés-kezelő saját, friss stádium-ellenőrzése adja.
  await prisma.questionnaireLink.updateMany({
    where: { leadId, usedAt: null, expiresAt: { gt: new Date() } },
    data: { expiresAt: new Date() },
  });

  const token = generateQuestionnaireToken();
  const expiresAt = questionnaireLinkExpiry();

  const link = await prisma.questionnaireLink.create({
    data: {
      token,
      leadId,
      templateId: template.id,
      expiresAt,
    },
  });

  const ttlDays = Number(process.env.QUESTIONNAIRE_LINK_TTL_DAYS) || 14;
  const locale: Locale = lead.locale === "en" ? "en" : "hu";
  const url = `${publicAppUrl()}/${locale}/kerdoiv/${token}`;

  const email = await renderEmailTemplate("questionnaire_invite", locale, {
    leadName: lead.name,
    link: url,
    expiresInDays: String(ttlDays),
  });

  const result = await sendTransactionalEmail({
    to: lead.email,
    subject: email.subject,
    html: email.html,
    text: email.text,
  });

  await writeAuditLog({
    userId: actingUserId,
    entityType: "Lead",
    entityId: leadId,
    action: "questionnaire.link_sent",
    metadata: {
      questionnaireLinkId: link.id,
      emailSent: result.ok,
      emailError: result.error ?? null,
    },
  });

  return { link, emailSent: result.ok };
}
