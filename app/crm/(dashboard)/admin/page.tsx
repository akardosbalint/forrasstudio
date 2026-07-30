import { requireRole } from "@/lib/auth/rbac";

export default async function AdminPage() {
  await requireRole("ADMIN");

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-semibold">Admin</h1>
      <p className="text-sm text-ink/60">
        Kérdőív-szerkesztő, email sablonok, pipeline-konfiguráció és audit
        log — a Phase 6-ban készül el.
      </p>
    </div>
  );
}
