import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { FALLBACK_EMAIL_TEMPLATES } from "@/lib/email/fallbackTemplates";
import { EditTemplateForm } from "./EditTemplateForm";

const VARIABLE_HINTS: Record<string, string[]> = {
  questionnaire_invite: ["leadName", "link", "expiresInDays"],
  questionnaire_submitted: ["leadName", "bookingLink"],
  booking_confirmation_client: ["leadName", "repName", "startsAtFormatted", "manageLink"],
  booking_confirmation_rep: ["leadName", "repName", "startsAtFormatted"],
  booking_reminder: ["leadName", "repName", "startsAtFormatted", "hoursLabel", "manageLink"],
  booking_cancelled: ["startsAtFormatted", "manageLink"],
};

export default async function EditEmailTemplatePage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  await requireRole("ADMIN");
  const { key } = await params;

  const dbTemplate = await prisma.emailTemplate.findUnique({
    where: { key_locale: { key, locale: "hu" } },
  });
  const fallback = FALLBACK_EMAIL_TEMPLATES.hu[key];
  const source = dbTemplate ?? fallback;

  if (!source) notFound();

  const hints = VARIABLE_HINTS[key] ?? [];

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold">{key}</h1>
      {hints.length > 0 && (
        <p className="text-xs text-ink/50">
          Elérhető változók:{" "}
          {hints.map((h) => (
            <code key={h} className="mr-1 rounded bg-paper-2 px-1 py-0.5">
              {`{{${h}}}`}
            </code>
          ))}
        </p>
      )}
      <EditTemplateForm
        templateKey={key}
        subject={source.subject}
        bodyHtml={source.bodyHtml}
        bodyText={source.bodyText}
      />
    </div>
  );
}
