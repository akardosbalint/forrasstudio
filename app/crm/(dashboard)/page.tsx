import Link from "next/link";
import { verifySession } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";

export default async function CrmOverviewPage() {
  await verifySession();

  const stages = await prisma.pipelineStage.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { leads: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Áttekintés</h1>
        <Link
          href="/crm/leads/new"
          className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper"
        >
          + Új lead
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stages.map((stage) => (
          <Link
            key={stage.id}
            href={`/crm/leads?stage=${stage.id}`}
            className="rounded-xl border border-paper-3 bg-white p-4 transition-colors hover:border-ink/30"
          >
            <div
              className="mb-2 h-1.5 w-8 rounded-full"
              style={{ backgroundColor: stage.color }}
            />
            <p className="text-sm text-ink/60">{stage.label}</p>
            <p className="font-display text-2xl font-semibold">
              {stage._count.leads}
            </p>
          </Link>
        ))}
      </div>
      <p className="text-sm text-ink/50">
        Részletes kanban nézet, szűrők és bevételi riportok a Phase 7-ben
        (Dashboard + reporting) készülnek el.
      </p>
    </div>
  );
}
