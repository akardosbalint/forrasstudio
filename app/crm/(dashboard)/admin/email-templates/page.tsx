import Link from "next/link";
import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { FALLBACK_EMAIL_TEMPLATES } from "@/lib/email/fallbackTemplates";

const KEY_LABELS: Record<string, string> = {
  questionnaire_invite: "Kérdőív kiküldés",
  questionnaire_submitted: "Kérdőív visszaigazolás (foglalási link)",
  booking_confirmation_client: "Foglalás visszaigazolás — ügyfél",
  booking_confirmation_rep: "Foglalás visszaigazolás — sales rep",
  booking_reminder: "Emlékeztető (24h/1h)",
  booking_cancelled: "Foglalás lemondva",
};

export default async function EmailTemplatesPage() {
  await requireRole("ADMIN");

  const dbTemplates = await prisma.emailTemplate.findMany({
    where: { locale: "hu" },
  });
  const dbKeys = new Set(dbTemplates.map((t) => t.key));
  const allKeys = Array.from(
    new Set([...Object.keys(FALLBACK_EMAIL_TEMPLATES.hu), ...dbKeys]),
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold">Email sablonok</h1>
      <div className="overflow-x-auto rounded-xl border border-paper-3 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-paper-3 text-left text-ink/50">
              <th className="px-4 py-3 font-medium">Sablon</th>
              <th className="px-4 py-3 font-medium">Állapot</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {allKeys.map((key) => (
              <tr key={key} className="border-b border-paper-3 last:border-0 hover:bg-paper-2/40">
                <td className="px-4 py-3">
                  <p className="font-medium">{KEY_LABELS[key] ?? key}</p>
                  <p className="text-xs text-ink/40">{key}</p>
                </td>
                <td className="px-4 py-3 text-ink/70">
                  {dbKeys.has(key) ? "Testreszabva" : "Alapértelmezett"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/crm/admin/email-templates/${key}`}
                    className="text-brook underline"
                  >
                    Szerkesztés
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
