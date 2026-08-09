import { Suspense } from "react";
import Link from "next/link";
import { verifySession } from "@/lib/auth/rbac";
import {
  getFilterOptions,
  getKanbanBoard,
  getRevenueSummary,
} from "@/lib/dashboard/queries";
import { isPeriod, type Period } from "@/lib/dashboard/period";
import { DashboardFilters } from "./DashboardFilters";
import { RevenueCards } from "./RevenueCards";
import { KanbanBoard } from "./KanbanBoard";

export default async function CrmOverviewPage({
  searchParams,
}: {
  searchParams: Promise<{
    ownerId?: string;
    source?: string;
    period?: string;
  }>;
}) {
  await verifySession();
  const params = await searchParams;
  const ownerId = params.ownerId ?? "";
  const source = params.source ?? "";
  const period: Period = isPeriod(params.period) ? params.period : "month";

  const filters = { ownerId, source };

  const [{ profiles, sources }, stages, revenue] = await Promise.all([
    getFilterOptions(),
    getKanbanBoard(filters),
    getRevenueSummary(period, filters),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Áttekintés</h1>
        <Link
          href="/crm/leads/new"
          className="bg-gradient-brand rounded-lg px-4 py-2 text-sm font-medium text-white"
        >
          + Új lead
        </Link>
      </div>

      <Suspense>
        <DashboardFilters
          profiles={profiles}
          sources={sources}
          currentOwnerId={ownerId}
          currentSource={source}
          currentPeriod={period}
        />
      </Suspense>

      <RevenueCards summary={revenue} />

      <KanbanBoard stages={stages} />
    </div>
  );
}
