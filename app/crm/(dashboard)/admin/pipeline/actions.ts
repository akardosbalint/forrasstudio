"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/rbac";
import { writeAuditLog } from "@/lib/audit/log";

export type FormState = { error?: string } | undefined;

function slugify(label: string): string {
  return label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // ékezetek eltávolítása (kombináló diakritikus jelek)
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export async function createStage(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const { profile } = await requireRole("ADMIN");

  const label = String(formData.get("label") ?? "").trim();
  const color = String(formData.get("color") ?? "#6366f1");
  const isTerminal = formData.get("isTerminal") === "on";

  if (!label) return { error: "A címke megadása kötelező." };

  const key = slugify(label);
  if (!key) return { error: "Érvénytelen címke." };

  const existing = await prisma.pipelineStage.findUnique({ where: { key } });
  if (existing) return { error: "Már létezik ilyen (vagy hasonló) nevű stádium." };

  const maxOrder = await prisma.pipelineStage.aggregate({
    _max: { order: true },
  });

  const stage = await prisma.pipelineStage.create({
    data: {
      key,
      label,
      color,
      isTerminal,
      isSystem: false,
      order: (maxOrder._max.order ?? 0) + 1,
    },
  });

  await writeAuditLog({
    userId: profile.id,
    entityType: "PipelineStage",
    entityId: stage.id,
    action: "pipeline_stage.created",
  });

  revalidatePath("/crm/admin/pipeline");
  return undefined;
}

export async function updateStage(formData: FormData): Promise<void> {
  const { profile } = await requireRole("ADMIN");

  const id = String(formData.get("id") ?? "");
  const label = String(formData.get("label") ?? "").trim();
  const color = String(formData.get("color") ?? "#6366f1");
  if (!id || !label) return;

  await prisma.pipelineStage.update({
    where: { id },
    data: { label, color },
  });

  await writeAuditLog({
    userId: profile.id,
    entityType: "PipelineStage",
    entityId: id,
    action: "pipeline_stage.updated",
    metadata: { label },
  });

  revalidatePath("/crm/admin/pipeline");
}

// A sorrendet kizárólag ez a függvény módosíthatja, mindig két szomszédos
// stádium order-értékének felcserélésével — soha nem fogad el egy
// tetszőleges, a felhasználó által beírt számot. Korábban a `order` egy
// szabad számmező volt a szerkesztő formon, validáció nélkül: két stádiumot
// azonos sorrend-értékre állítva a `canTransition` (lib/pipeline/
// stateMachine.ts) `to.order > from.order` szabálya miatt egy sales rep
// egyik irányba sem tudta többé mozgatni a leadet a két stádium között,
// néma, hibaüzenet nélküli állapotban.
export async function moveStage(formData: FormData): Promise<void> {
  const { profile } = await requireRole("ADMIN");
  const id = String(formData.get("id") ?? "");
  const direction = String(formData.get("direction") ?? "");
  if (!id) return;

  const stages = await prisma.pipelineStage.findMany({
    orderBy: { order: "asc" },
  });
  const index = stages.findIndex((stage) => stage.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= stages.length) return;

  const current = stages[index];
  const swapWith = stages[swapIndex];

  await prisma.$transaction([
    prisma.pipelineStage.update({
      where: { id: current.id },
      data: { order: swapWith.order },
    }),
    prisma.pipelineStage.update({
      where: { id: swapWith.id },
      data: { order: current.order },
    }),
  ]);

  await writeAuditLog({
    userId: profile.id,
    entityType: "PipelineStage",
    entityId: id,
    action: "pipeline_stage.reordered",
  });

  revalidatePath("/crm/admin/pipeline");
}

export async function deleteStage(formData: FormData): Promise<void> {
  const { profile } = await requireRole("ADMIN");
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const stage = await prisma.pipelineStage.findUnique({
    where: { id },
    include: { _count: { select: { leads: true } } },
  });
  if (!stage || stage.isSystem || stage._count.leads > 0) return;

  await prisma.pipelineStage.delete({ where: { id } });

  await writeAuditLog({
    userId: profile.id,
    entityType: "PipelineStage",
    entityId: id,
    action: "pipeline_stage.deleted",
  });

  revalidatePath("/crm/admin/pipeline");
}
