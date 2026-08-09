import { verifySession } from "@/lib/auth/rbac";
import { ProfileForm } from "./ProfileForm";

export default async function ProfileSettingsPage() {
  const { profile } = await verifySession();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold">Profil</h1>

      <section className="rounded-xl border border-paper-3 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink/50">
          Megjelenített név
        </h2>
        <p className="mb-4 text-sm text-ink/60">
          Ez a név jelenik meg a CRM felületén, valamint a leadeknek küldött
          emailekben (pl. &bdquo;{"{{repName}}"} kollégánkkal&rdquo;).
        </p>
        <ProfileForm currentName={profile.name} />
      </section>
    </div>
  );
}
