"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/rbac";
import { writeAuditLog } from "@/lib/audit/log";
import { SYSTEM_STAGE_KEYS } from "@/lib/pipeline/stages";

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

export async function changeLeadStage(formData: FormData): Promise<void> {
  const { profile } = await requireRole("ADMIN", "SALES_REP");

  const leadId = String(formData.get("leadId") ?? "");
  const toStageId = String(formData.get("toStageId") ?? "");
  const note = formData.get("note");

  if (!leadId || !toStageId) {
    throw new Error("Hiányzó lead vagy stádium azonosító.");
  }

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) {
    throw new Error("A lead nem található.");
  }

  // Sales rep csak a saját (vagy gazdátlan) leadjeit módosíthatja, admin bármit.
  if (
    profile.role === "SALES_REP" &&
    lead.ownerId &&
    lead.ownerId !== profile.id
  ) {
    throw new Error("Nincs jogosultságod ehhez a leadhez.");
  }

  const fromStageId = lead.currentStageId;

  await prisma.$transaction([
    prisma.lead.update({
      where: { id: leadId },
      data: { currentStageId: toStageId },
    }),
    prisma.statusHistory.create({
      data: {
        leadId,
        fromStageId,
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
    metadata: { fromStageId, toStageId },
  });

  revalidatePath(`/crm/leads/${leadId}`);
  revalidatePath("/crm/leads");
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
