import Link from "next/link";
import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 50;

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{
    entityType?: string;
    action?: string;
    page?: string;
  }>;
}) {
  await requireRole("ADMIN");
  const { entityType, action, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const where = {
    entityType: entityType || undefined,
    action: action ? { contains: action } : undefined,
  };

  const [entries, total, entityTypes] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      distinct: ["entityType"],
      select: { entityType: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function buildQuery(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const merged = { entityType, action, ...overrides };
    for (const [k, v] of Object.entries(merged)) {
      if (v) params.set(k, v);
    }
    return `?${params.toString()}`;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold">Audit log</h1>

      <div className="flex flex-wrap gap-2 text-sm">
        <Link
          href="/crm/admin/audit-log"
          className={`rounded-full border px-3 py-1 ${
            !entityType ? "border-ink bg-ink text-paper" : "border-paper-3"
          }`}
        >
          Összes
        </Link>
        {entityTypes.map((et) => (
          <Link
            key={et.entityType}
            href={`/crm/admin/audit-log${buildQuery({ entityType: et.entityType, page: undefined })}`}
            className={`rounded-full border px-3 py-1 ${
              entityType === et.entityType
                ? "border-ink bg-ink text-paper"
                : "border-paper-3"
            }`}
          >
            {et.entityType}
          </Link>
        ))}
      </div>

      <form method="GET" className="flex items-center gap-2">
        {entityType && <input type="hidden" name="entityType" value={entityType} />}
        <input
          type="text"
          name="action"
          defaultValue={action}
          placeholder="Szűrés művelet szerint (pl. lead.stage_changed)"
          className="w-80 rounded-lg border border-paper-3 bg-white px-3 py-2 text-sm outline-none focus:border-brook"
        />
        <button
          type="submit"
          className="rounded-lg border border-paper-3 px-3 py-2 text-sm font-medium"
        >
          Szűrés
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-paper-3 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-paper-3 text-left text-ink/50">
              <th className="px-4 py-3 font-medium">Időpont</th>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Entitás</th>
              <th className="px-4 py-3 font-medium">Művelet</th>
              <th className="px-4 py-3 font-medium">Részletek</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-paper-3 last:border-0">
                <td className="px-4 py-3 text-ink/50">
                  {entry.createdAt.toLocaleString("hu-HU")}
                </td>
                <td className="px-4 py-3 text-ink/70">
                  {entry.user?.name ?? "rendszer"}
                </td>
                <td className="px-4 py-3 text-ink/70">
                  {entry.entityType} <span className="text-ink/40">#{entry.entityId.slice(0, 8)}</span>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{entry.action}</td>
                <td className="px-4 py-3 text-ink/50">
                  {entry.metadata ? (
                    <code className="text-xs">
                      {JSON.stringify(entry.metadata)}
                    </code>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink/50">
                  Nincs találat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-ink/60">
        <span>
          {page}. oldal / {totalPages}
        </span>
        <div className="flex gap-2">
          {page > 1 && (
            <Link
              href={`/crm/admin/audit-log${buildQuery({ page: String(page - 1) })}`}
              className="rounded-lg border border-paper-3 px-3 py-1"
            >
              Előző
            </Link>
          )}
          {page < totalPages && (
            <Link
              href={`/crm/admin/audit-log${buildQuery({ page: String(page + 1) })}`}
              className="rounded-lg border border-paper-3 px-3 py-1"
            >
              Következő
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
