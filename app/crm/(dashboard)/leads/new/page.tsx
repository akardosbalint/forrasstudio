import { requireRole } from "@/lib/auth/rbac";
import { getAssignableProfiles } from "@/lib/leads/queries";
import { NewLeadForm } from "./NewLeadForm";

export default async function NewLeadPage() {
  await requireRole("ADMIN", "SALES_REP");
  const profiles = await getAssignableProfiles();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold">Új lead</h1>
      <NewLeadForm profiles={profiles} />
    </div>
  );
}
