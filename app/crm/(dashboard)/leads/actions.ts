"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/rbac";
import { writeAuditLog } from "@/lib/audit/log";
import { SYSTEM_STAGE_KEYS } from "@/lib/pipeline/stages";
import { canTransition } from "@/lib/pipeline/stateMachine";
import { triggerQuestionnaireSend } from "@/lib/questionnaire/dispatch";
import { BookingError, cancelBookingCore } from "@/lib/booking/actions-core";

const createLeadSchema = z.object({
  name: z.string().trim().min(1, "A név megadása kötelező."),
  phone: z.string().trim().min(1, "A telefonszám megadása kötelező."),
  company: z.string().trim().optional(),
  email: z.string().trim().email().optional().or(z.literal("")),
  message: z.string().trim().optional(),
  ownerId: z.string().uuid().optional().or(z.literal("")),
});

export type CreateLeadState = { error?: string } | undefined;

export async function createLead(
  _prevState: CreateLeadState,
  formData: FormData,
): Promise<CreateLeadState> {
  const { profile } = await requireRole("ADMIN", "SALES_REP");

  const parsed = createLeadSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    company: formData.get("company"),
    email: formData.get("email"),
    message: formData.get("message"),
    ownerId: formData.get("ownerId"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Érvénytelen adat." };
  }

  const data = parsed.data;

  const initialStage = await prisma.pipelineStage.findUnique({
    where: { key: SYSTEM_STAGE_KEYS.CALLBACK_PENDING },
  });
  if (!initialStage) {
    return {
      error:
        "A pipeline nincs beüzemelve (hiányzó alap stádiumok) — futtasd le a seed scriptet.",
    };
  }

  const lead = await prisma.lead.create({
    data: {
      name: data.name,
      phone: data.phone,
      company: data.company || null,
      email: data.email || null,
      message: data.message || null,
      source: "manual",
      currentStageId: initialStage.id,
      ownerId: data.ownerId || profile.id,
    },
  });

  await prisma.statusHistory.create({
    data: {
      leadId: lead.id,
      toStageId: initialStage.id,
      changedById: profile.id,
      note: "Lead manuálisan rögzítve.",
    },
  });

  await writeAuditLog({
    userId: profile.id,
    entityType: "Lead",
    entityId: lead.id,
    action: "lead.created",
    metadata: { source: "manual" },
  });

  revalidatePath("/crm/leads");
  redirect(`/crm/leads/${lead.id}`);
}

export type ChangeLeadStageState =
  | { error?: string; warning?: string }
  | undefined;

export async function changeLeadStage(
  _prevState: ChangeLeadStageState,
  formData: FormData,
): Promise<ChangeLeadStageState> {
  const { profile } = await requireRole("ADMIN", "SALES_REP");

  const leadId = String(formData.get("leadId") ?? "");
  const toStageId = String(formData.get("toStageId") ?? "");
  const note = formData.get("note");

  if (!leadId || !toStageId) {
    return { error: "Hiányzó lead vagy stádium azonosító." };
  }

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) {
    return { error: "A lead nem található." };
  }

  // Sales rep csak a saját (vagy gazdátlan) leadjeit módosíthatja, admin bármit.
  if (
    profile.role === "SALES_REP" &&
    lead.ownerId &&
    lead.ownerId !== profile.id
  ) {
    return { error: "Nincs jogosultságod ehhez a leadhez." };
  }

  const [fromStage, toStage] = await Promise.all([
    prisma.pipelineStage.findUnique({ where: { id: lead.currentStageId } }),
    prisma.pipelineStage.findUnique({ where: { id: toStageId } }),
  ]);
  if (!fromStage || !toStage) {
    return { error: "A stádium nem található." };
  }

  if (!canTransition(fromStage, toStage, profile.role)) {
    return {
      error: `Nem engedélyezett átmenet: "${fromStage.label}" → "${toStage.label}".`,
    };
  }

  // A kérdőív-kiküldés triggerelő stádiumba lépés előfeltételeit itt
  // validáljuk, mielőtt a leadet ténylegesen átmozgatnánk — így nem
  // kerülhet olyan állapotba, ami "kiküldve"-t állít, miközben nem sikerült
  // linket generálni.
  if (toStage.key === SYSTEM_STAGE_KEYS.QUESTIONNAIRE_SENDING) {
    if (!lead.email) {
      return {
        error:
          "A leadhez nincs email cím rögzítve — a kérdőívet nem lehet kiküldeni. Rögzítsd az email címet, majd próbáld újra.",
      };
    }
    const activeTemplate = await prisma.questionnaireTemplate.findFirst({
      where: { isActive: true },
    });
    if (!activeTemplate) {
      return {
        error:
          "Nincs aktív kérdőív-sablon — hozz létre egyet az admin felületen, mielőtt kiküldöd.",
      };
    }
  }

  await prisma.$transaction([
    prisma.lead.update({
      where: { id: leadId },
      data: { currentStageId: toStageId },
    }),
    prisma.statusHistory.create({
      data: {
        leadId,
        fromStageId: fromStage.id,
        toStageId,
        changedById: profile.id,
        note: typeof note === "string" && note.trim() ? note.trim() : null,
      },
    }),
  ]);

  await writeAuditLog({
    userId: profile.id,
    entityType: "Lead",
    entityId: leadId,
    action: "lead.stage_changed",
    metadata: { fromStageId: fromStage.id, toStageId },
  });

  let warning: string | undefined;
  if (toStage.key === SYSTEM_STAGE_KEYS.QUESTIONNAIRE_SENDING) {
    try {
      const result = await triggerQuestionnaireSend(leadId, profile.id);
      if (!result.emailSent) {
        warning =
          "A stádium frissült, de a kérdőív-link emailben való kiküldése nem sikerült (Resend nincs beállítva vagy hibát adott — lásd audit log).";
      }
    } catch (error) {
      warning =
        error instanceof Error
          ? error.message
          : "Ismeretlen hiba a kérdőív kiküldésekor.";
    }
  }

  revalidatePath(`/crm/leads/${leadId}`);
  revalidatePath("/crm/leads");
  return { warning };
}

export async function assignLeadOwner(formData: FormData): Promise<void> {
  const { profile } = await requireRole("ADMIN");

  const leadId = String(formData.get("leadId") ?? "");
  const ownerId = String(formData.get("ownerId") ?? "");

  await prisma.lead.update({
    where: { id: leadId },
    data: { ownerId: ownerId || null },
  });

  await writeAuditLog({
    userId: profile.id,
    entityType: "Lead",
    entityId: leadId,
    action: "lead.owner_changed",
    metadata: { ownerId: ownerId || null },
  });

  revalidatePath(`/crm/leads/${leadId}`);
}

export type CancelBookingState = { error?: string } | undefined;

export async function cancelBookingInternal(
  _prevState: CancelBookingState,
  formData: FormData,
): Promise<CancelBookingState> {
  const { profile } = await requireRole("ADMIN", "SALES_REP");

  const bookingId = String(formData.get("bookingId") ?? "");
  const leadId = String(formData.get("leadId") ?? "");
  if (!bookingId || !leadId) {
    return { error: "Hiányzó azonosító." };
  }

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) return { error: "A lead nem található." };
  if (
    profile.role === "SALES_REP" &&
    lead.ownerId &&
    lead.ownerId !== profile.id
  ) {
    return { error: "Nincs jogosultságod ehhez a leadhez." };
  }

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");

  try {
    await cancelBookingCore({
      bookingId,
      actingUserId: profile.id,
      manageLinkBase: `${appUrl}/crm/leads/${leadId}`,
    });
  } catch (error) {
    return {
      error:
        error instanceof BookingError
          ? error.message
          : "Ismeretlen hiba a lemondás során.",
    };
  }

  revalidatePath(`/crm/leads/${leadId}`);
  return undefined;
}

export type UpdateFinancialsState = { error?: string } | undefined;

// A forint-összegeket fillér-pontosságú egészként tároljuk (spec 6. pont
// adatmodell-vázlata), a form viszont forintban kér bemenetet a
// felhasználótól.
export async function updateLeadFinancials(
  _prevState: UpdateFinancialsState,
  formData: FormData,
): Promise<UpdateFinancialsState> {
  const { profile } = await requireRole("ADMIN", "SALES_REP");

  const leadId = String(formData.get("leadId") ?? "");
  const dealValueHuf = String(formData.get("dealValueHuf") ?? "").trim();
  const cashCollectedHuf = String(formData.get("cashCollectedHuf") ?? "").trim();

  if (!leadId) return { error: "Hiányzó lead azonosító." };

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) return { error: "A lead nem található." };
  if (
    profile.role === "SALES_REP" &&
    lead.ownerId &&
    lead.ownerId !== profile.id
  ) {
    return { error: "Nincs jogosultságod ehhez a leadhez." };
  }

  const dealValueCents = dealValueHuf ? Math.round(Number(dealValueHuf) * 100) : null;
  const cashCollectedCents = cashCollectedHuf
    ? Math.round(Number(cashCollectedHuf) * 100)
    : null;

  if (
    (dealValueHuf && Number.isNaN(dealValueCents)) ||
    (cashCollectedHuf && Number.isNaN(cashCollectedCents))
  ) {
    return { error: "Érvénytelen összeg." };
  }

  await prisma.lead.update({
    where: { id: leadId },
    data: { dealValueCents, cashCollectedCents },
  });

  await writeAuditLog({
    userId: profile.id,
    entityType: "Lead",
    entityId: leadId,
    action: "lead.financials_updated",
    metadata: { dealValueCents, cashCollectedCents },
  });

  revalidatePath(`/crm/leads/${leadId}`);
  return undefined;
}
