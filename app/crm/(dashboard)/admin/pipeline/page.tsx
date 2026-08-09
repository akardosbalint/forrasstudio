import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { StageRow } from "./StageRow";
import { CreateStageForm } from "./CreateStageForm";

export default async function PipelinePage() {
  await requireRole("ADMIN");

  const stages = await prisma.pipelineStage.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { leads: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">
          Pipeline-szerkesztő
        </h1>
        <p className="text-sm text-ink/50">
          A rendszer-stádiumok (Visszahívásra vár, Kérdőív kitöltés alatt,
          Időpontfoglalásra vár, Discovery call lefoglalva) nem törölhetők,
          mert kódból triggerelt logika kötődik hozzájuk — a sorrendjük és
          megjelenítésük viszont igen.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-paper-3 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-paper-3 text-left text-ink/50">
              <th className="px-4 py-3 font-medium">Sorrend</th>
              <th className="px-4 py-3 font-medium">Stádium</th>
              <th className="px-4 py-3 font-medium">Típus</th>
              <th className="px-4 py-3 font-medium">Leadek</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {stages.map((stage, index) => (
              <StageRow
                key={stage.id}
                stage={stage}
                leadCount={stage._count.leads}
                isFirst={index === 0}
                isLast={index === stages.length - 1}
              />
            ))}
          </tbody>
        </table>
      </div>

      <CreateStageForm />
    </div>
  );
}
