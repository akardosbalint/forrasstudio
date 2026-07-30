import Link from "next/link";
import { requireRole } from "@/lib/auth/rbac";

const SECTIONS = [
  {
    href: "/crm/admin/questionnaires",
    title: "Kérdőív-szerkesztő",
    description:
      "A rendszertervezési kérdőív kérdéseinek konfigurálása — kérdéstípusok, kötelező/opcionális, sorrend.",
  },
  {
    href: "/crm/admin/email-templates",
    title: "Email sablonok",
    description:
      "Kérdőív kiküldés, foglalás-visszaigazolás, emlékeztető és lemondás emailek szövegének szerkesztése.",
  },
  {
    href: "/crm/admin/pipeline",
    title: "Pipeline-szerkesztő",
    description:
      "Stádiumok sorrendje, címkéje, színe; új (nem rendszer-) stádiumok hozzáadása.",
  },
  {
    href: "/crm/admin/audit-log",
    title: "Audit log",
    description: "Ki, mikor, milyen módosítást végzett a rendszerben.",
  },
];

export default async function AdminPage() {
  await requireRole("ADMIN");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold">Admin</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-xl border border-paper-3 bg-white p-5 transition-colors hover:border-ink/30"
          >
            <h2 className="mb-1 font-display text-lg font-semibold">
              {section.title}
            </h2>
            <p className="text-sm text-ink/60">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
