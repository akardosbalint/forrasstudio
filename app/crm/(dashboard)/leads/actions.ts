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

class StageChangeError extends Error {}

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

  const toStage = await prisma.pipelineStage.findUnique({ where: { id: toStageId } });
  if (!toStage) {
    return { error: "A stádium nem található." };
  }

  let fromStageId: string;
  try {
    fromStageId = await prisma.$transaction(async (tx) => {
      // A leadet és a jelenlegi stádiumát a tranzakción belül, frissen
      // olvassuk — nem a kérés elején (esetleg azóta elavult) állapotot. Ha
      // egy konkurrens kérés időközben már máshova mozgatta a leadet, ne
      // egy elavult `fromStage` alapján validáljunk és írjunk felül.
      const freshLead = await tx.lead.findUnique({ where: { id: leadId } });
      if (!freshLead) {
        throw new StageChangeError("A lead nem található.");
      }

      // Sales rep csak a saját (vagy gazdátlan) leadjeit módosíthatja, admin bármit.
      if (
        profile.role === "SALES_REP" &&
        freshLead.ownerId &&
        freshLead.ownerId !== profile.id
      ) {
        throw new StageChangeError("Nincs jogosultságod ehhez a leadhez.");
      }

      const fromStage = await tx.pipelineStage.findUnique({
        where: { id: freshLead.currentStageId },
      });
      if (!fromStage) {
        throw new StageChangeError("A stádium nem található.");
      }

      if (!canTransition(fromStage, toStage, profile.role)) {
        throw new StageChangeError(
          `Nem engedélyezett átmenet: "${fromStage.label}" → "${toStage.label}".`,
        );
      }

      // A kérdőív-kiküldés triggerelő stádiumba lépés előfeltételeit itt
      // validáljuk, mielőtt a leadet ténylegesen átmozgatnánk — így nem
      // kerülhet olyan állapotba, ami "kiküldve"-t állít, miközben nem
      // sikerült linket generálni.
      if (toStage.key === SYSTEM_STAGE_KEYS.QUESTIONNAIRE_SENDING) {
        if (!freshLead.email) {
          throw new StageChangeError(
            "A leadhez nincs email cím rögzítve — a kérdőívet nem lehet kiküldeni. Rögzítsd az email címet, majd próbáld újra.",
          );
        }
        const activeTemplate = await tx.questionnaireTemplate.findFirst({
          where: { isActive: true },
        });
        if (!activeTemplate) {
          throw new StageChangeError(
            "Nincs aktív kérdőív-sablon — hozz létre egyet az admin felületen, mielőtt kiküldöd.",
          );
        }
      }

      // Feltételes update: csak akkor írjuk, ha a lead a tranzakció eleje óta
      // még mindig a frissen ellenőrzött `fromStage`-ben van — konkurrens
      // módosítás esetén a `count` 0, és nem íródik felül egy időközben
      // történt (esetleg épp emiatt már érvénytelen) változás.
      const updated = await tx.lead.updateMany({
        where: { id: leadId, currentStageId: fromStage.id },
        data: { currentStageId: toStageId },
      });
      if (updated.count === 0) {
        throw new StageChangeError(
          "A lead státusza időközben megváltozott — frissítsd az oldalt, és próbáld újra.",
        );
      }

      await tx.statusHistory.create({
        data: {
          leadId,
          fromStageId: fromStage.id,
          toStageId,
          changedById: profile.id,
          note: typeof note === "string" && note.trim() ? note.trim() : null,
        },
      });

      return fromStage.id;
    });
  } catch (error) {
    return {
      error:
        error instanceof StageChangeError
          ? error.message
          : "Ismeretlen hiba történt a stádiumváltás során.",
    };
  }

  await writeAuditLog({
    userId: profile.id,
    entityType: "Lead",
    entityId: leadId,
    action: "lead.stage_changed",
    metadata: { fromStageId, toStageId },
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

export type AssignLeadOwnerState = { error?: string } | undefined;

export async function assignLeadOwner(
  _prevState: AssignLeadOwnerState,
  formData: FormData,
): Promise<AssignLeadOwnerState> {
  const { profile } = await requireRole("ADMIN");

  const leadId = String(formData.get("leadId") ?? "");
  const ownerId = String(formData.get("ownerId") ?? "");
  if (!leadId) return { error: "Hiányzó lead azonosító." };

  if (ownerId) {
    const owner = await prisma.profile.findUnique({ where: { id: ownerId } });
    if (!owner || !["ADMIN", "SALES_REP"].includes(owner.role)) {
      return { error: "Érvénytelen felelős — válassz a listából." };
    }
  }

  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: { ownerId: ownerId || null },
    });
  } catch {
    return { error: "A lead nem található, vagy nem sikerült frissíteni." };
  }

  await writeAuditLog({
    userId: profile.id,
    entityType: "Lead",
    entityId: leadId,
    action: "lead.owner_changed",
    metadata: { ownerId: ownerId || null },
  });

  revalidatePath(`/crm/leads/${leadId}`);
  return undefined;
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
  if (
    (dealValueCents !== null && dealValueCents < 0) ||
    (cashCollectedCents !== null && cashCollectedCents < 0)
  ) {
    return { error: "Az összeg nem lehet negatív." };
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

export type ResendQuestionnaireState =
  | { error?: string; warning?: string; success?: boolean }
  | undefined;

// Kérdőív-link újraküldése — anélkül, hogy a stádiumot ki-be kellene
// mozgatni ehhez (ami korábban egy elavult link visszaregressziózhatta a
// lead státuszát). Csak akkor van értelme, amíg a lead ténylegesen
// "Kérdőív kitöltés alatt" státuszban van.
export async function resendQuestionnaireInvite(
  _prevState: ResendQuestionnaireState,
  formData: FormData,
): Promise<ResendQuestionnaireState> {
  const { profile } = await requireRole("ADMIN", "SALES_REP");

  const leadId = String(formData.get("leadId") ?? "");
  if (!leadId) return { error: "Hiányzó lead azonosító." };

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { currentStage: true },
  });
  if (!lead) return { error: "A lead nem található." };
  if (
    profile.role === "SALES_REP" &&
    lead.ownerId &&
    lead.ownerId !== profile.id
  ) {
    return { error: "Nincs jogosultságod ehhez a leadhez." };
  }
  if (lead.currentStage.key !== SYSTEM_STAGE_KEYS.QUESTIONNAIRE_SENDING) {
    return {
      error:
        "A lead nincs \"Kérdőív kitöltés alatt\" státuszban — az újraküldés csak ekkor lehetséges.",
    };
  }

  try {
    const result = await triggerQuestionnaireSend(leadId, profile.id);
    if (!result.emailSent) {
      return {
        warning:
          "Új link generálva, de az email kiküldése nem sikerült (Resend nincs beállítva vagy hibát adott — lásd audit log).",
      };
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Ismeretlen hiba a kérdőív újraküldésekor.",
    };
  }

  revalidatePath(`/crm/leads/${leadId}`);
  return { success: true };
}
