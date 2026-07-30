import "server-only";

import { prisma } from "@/lib/prisma";

export async function getAssignableProfiles() {
  return prisma.profile.findMany({
    where: { role: { in: ["ADMIN", "SALES_REP"] } },
    orderBy: { name: "asc" },
  });
}

export async function listLeads(params: { stageId?: string; ownerId?: string }) {
  return prisma.lead.findMany({
    where: {
      currentStageId: params.stageId || undefined,
      ownerId: params.ownerId || undefined,
    },
    include: { currentStage: true, owner: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getLeadDetail(leadId: string) {
  return prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      currentStage: true,
      owner: true,
      statusHistory: {
        include: { fromStage: true, toStage: true, changedBy: true },
        orderBy: { changedAt: "desc" },
      },
      questionnaireResponses: { include: { template: true } },
      questionnaireLinks: { orderBy: { createdAt: "desc" } },
      bookings: { include: { rep: true }, orderBy: { startsAt: "desc" } },
    },
  });
}

export async function listPipelineStages() {
  return prisma.pipelineStage.findMany({ orderBy: { order: "asc" } });
}
