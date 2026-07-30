import "server-only";

import { prisma } from "@/lib/prisma";
import { periodStart, type Period } from "@/lib/dashboard/period";
import { SYSTEM_STAGE_KEYS } from "@/lib/pipeline/stages";

export type DashboardFilters = {
  ownerId?: string;
  source?: string;
};

export async function getFilterOptions() {
  const [profiles, sources] = await Promise.all([
    prisma.profile.findMany({
      where: { role: { in: ["ADMIN", "SALES_REP"] } },
      orderBy: { name: "asc" },
    }),
    prisma.lead.findMany({
      distinct: ["source"],
      select: { source: true },
      orderBy: { source: "asc" },
    }),
  ]);
  return { profiles, sources: sources.map((s) => s.source) };
}

export async function getKanbanBoard(filters: DashboardFilters) {
  const stages = await prisma.pipelineStage.findMany({
    orderBy: { order: "asc" },
    include: {
      leads: {
        where: {
          ownerId: filters.ownerId || undefined,
          source: filters.source || undefined,
        },
        include: { owner: true },
        orderBy: { updatedAt: "desc" },
      },
    },
  });
  return stages;
}

// Egy lead legutóbbi belépésének időpontja egy adott stádiumba
// (StatusHistory alapján) — a bevételi mutatók erre az időpontra
// (nem a lead létrehozására) vannak bontva, mert a "mikor lett kiadva
// az ajánlat" / "mikor nyertük meg" kérdés releváns egy pénzügyi
// riporthoz, nem a lead eredeti beérkezése.
async function leadsEnteredStageSince(
  stageKey: string,
  since: Date | null,
  filters: DashboardFilters,
) {
  const entries = await prisma.statusHistory.findMany({
    where: {
      toStage: { key: stageKey },
      changedAt: since ? { gte: since } : undefined,
      lead: {
        ownerId: filters.ownerId || undefined,
        source: filters.source || undefined,
      },
    },
    include: { lead: true },
    orderBy: { changedAt: "desc" },
  });

  // Dedup: ha egy lead többször is belépett ugyanabba a stádiumba
  // (pl. újranyitás után újra megnyerve), csak a legutóbbit számítjuk.
  const seen = new Set<string>();
  const deduped = [];
  for (const entry of entries) {
    if (seen.has(entry.leadId)) continue;
    seen.add(entry.leadId);
    deduped.push(entry.lead);
  }
  return deduped;
}

export type RevenueSummary = {
  period: Period;
  proposalsIssued: { count: number; totalCents: number };
  won: { count: number; tcvCents: number; cashCollectedCents: number };
  lost: { count: number };
};

export async function getRevenueSummary(
  period: Period,
  filters: DashboardFilters,
): Promise<RevenueSummary> {
  const since = periodStart(period);

  const [proposalLeads, wonLeads, lostLeads] = await Promise.all([
    leadsEnteredStageSince("proposal_drafting", since, filters),
    leadsEnteredStageSince(SYSTEM_STAGE_KEYS.WON, since, filters),
    leadsEnteredStageSince(SYSTEM_STAGE_KEYS.LOST, since, filters),
  ]);

  return {
    period,
    proposalsIssued: {
      count: proposalLeads.length,
      totalCents: proposalLeads.reduce(
        (sum, lead) => sum + (lead.dealValueCents ?? 0),
        0,
      ),
    },
    won: {
      count: wonLeads.length,
      tcvCents: wonLeads.reduce(
        (sum, lead) => sum + (lead.dealValueCents ?? 0),
        0,
      ),
      cashCollectedCents: wonLeads.reduce(
        (sum, lead) => sum + (lead.cashCollectedCents ?? 0),
        0,
      ),
    },
    lost: { count: lostLeads.length },
  };
}
