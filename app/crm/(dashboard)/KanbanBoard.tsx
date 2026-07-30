import Link from "next/link";
import type {
  Lead,
  PipelineStage,
  Profile,
} from "@/generated/prisma/client";

type StageWithLeads = PipelineStage & {
  leads: (Lead & { owner: Profile | null })[];
};

export function KanbanBoard({ stages }: { stages: StageWithLeads[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {stages.map((stage) => (
        <div
          key={stage.id}
          className="flex w-64 shrink-0 flex-col gap-3 rounded-xl border border-paper-3 bg-paper-2/40 p-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: stage.color }}
              />
              <h3 className="text-sm font-semibold">{stage.label}</h3>
            </div>
            <span className="text-xs text-ink/40">{stage.leads.length}</span>
          </div>
          <div className="flex flex-col gap-2">
            {stage.leads.map((lead) => (
              <Link
                key={lead.id}
                href={`/crm/leads/${lead.id}`}
                className="rounded-lg border border-paper-3 bg-white p-3 text-sm transition-colors hover:border-ink/30"
              >
                <p className="font-medium">{lead.name}</p>
                {lead.company && (
                  <p className="text-xs text-ink/50">{lead.company}</p>
                )}
                <p className="mt-1 text-xs text-ink/40">
                  {lead.owner?.name ?? "gazdátlan"}
                </p>
              </Link>
            ))}
            {stage.leads.length === 0 && (
              <p className="px-1 text-xs text-ink/30">Üres</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
