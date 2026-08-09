import Link from "next/link";
import { verifySession } from "@/lib/auth/rbac";
import { listLeads, listPipelineStages } from "@/lib/leads/queries";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string }>;
}) {
  await verifySession();
  const { stage } = await searchParams;

  const [leads, stages] = await Promise.all([
    listLeads({ stageId: stage }),
    listPipelineStages(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Leadek</h1>
        <Link
          href="/crm/leads/new"
          className="bg-gradient-brand rounded-lg px-4 py-2 text-sm font-medium text-white"
        >
          + Új lead
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        <Link
          href="/crm/leads"
          className={`rounded-full border px-3 py-1 ${
            !stage
              ? "bg-gradient-brand border-transparent text-white"
              : "border-paper-3 text-ink/70"
          }`}
        >
          Összes
        </Link>
        {stages.map((s) => (
          <Link
            key={s.id}
            href={`/crm/leads?stage=${s.id}`}
            className={`rounded-full border px-3 py-1 ${
              stage === s.id
                ? "bg-gradient-brand border-transparent text-white"
                : "border-paper-3 text-ink/70"
            }`}
          >
            {s.label}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-paper-3 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-paper-3 text-left text-ink/50">
              <th className="px-4 py-3 font-medium">Név</th>
              <th className="px-4 py-3 font-medium">Cég</th>
              <th className="px-4 py-3 font-medium">Stádium</th>
              <th className="px-4 py-3 font-medium">Felelős</th>
              <th className="px-4 py-3 font-medium">Forrás</th>
              <th className="px-4 py-3 font-medium">Létrehozva</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="border-b border-paper-3 last:border-0 hover:bg-paper-2/40"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/crm/leads/${lead.id}`}
                    className="font-medium text-ink hover:underline"
                  >
                    {lead.name}
                  </Link>
                  <div className="text-ink/50">{lead.phone}</div>
                </td>
                <td className="px-4 py-3 text-ink/70">
                  {lead.company ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="rounded-full px-2 py-1 text-xs font-medium text-white"
                    style={{ backgroundColor: lead.currentStage.color }}
                  >
                    {lead.currentStage.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink/70">
                  {lead.owner?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-ink/70">{lead.source}</td>
                <td className="px-4 py-3 text-ink/50">
                  {lead.createdAt.toLocaleDateString("hu-HU")}
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink/50">
                  Nincs még lead ebben a szűrésben.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
