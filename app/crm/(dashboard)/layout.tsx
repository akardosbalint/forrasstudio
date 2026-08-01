import Link from "next/link";
import { verifySession } from "@/lib/auth/rbac";
import { SignOutButton } from "./SignOutButton";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  SALES_REP: "Sales rep",
  VIEWER: "Néző",
};

export default async function CrmDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { profile } = await verifySession();

  const navItems = [
    { href: "/crm", label: "Áttekintés" },
    { href: "/crm/leads", label: "Leadek" },
    { href: "/crm/settings/calendar", label: "Naptár beállítások" },
    ...(profile.role === "ADMIN"
      ? [{ href: "/crm/admin", label: "Admin" }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-paper font-sans text-ink">
      <header className="border-b border-paper-3 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <Link href="/crm" className="font-display text-lg font-semibold">
              FlowCore CRM
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-ink/70 transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-ink/60">
              {profile.name}{" "}
              <span className="rounded-full bg-paper-2 px-2 py-0.5 text-xs font-medium text-ink/70">
                {ROLE_LABELS[profile.role] ?? profile.role}
              </span>
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
