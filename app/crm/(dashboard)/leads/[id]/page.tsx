import { notFound } from "next/navigation";
import { verifySession } from "@/lib/auth/rbac";
import { getLeadDetail, listPipelineStages } from "@/lib/leads/queries";
import { StageChangeForm } from "./StageChangeForm";
import { CancelBookingButton } from "./CancelBookingButton";
import { FinancialsForm } from "./FinancialsForm";
import { ContactInfoForm } from "./ContactInfoForm";
import { ResendQuestionnaireButton } from "./ResendQuestionnaireButton";
import { SYSTEM_STAGE_KEYS } from "@/lib/pipeline/stages";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await verifySession();
  const { id } = await params;

  const [lead, stages] = await Promise.all([
    getLeadDetail(id),
    listPipelineStages(),
  ]);

  if (!lead) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">{lead.name}</h1>
      </div>

      <section className="rounded-xl border border-paper-3 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink/50">
          Kapcsolattartási adatok
        </h2>
        <ContactInfoForm
          leadId={lead.id}
          name={lead.name}
          phone={lead.phone}
          company={lead.company}
          email={lead.email}
          message={lead.message}
          locale={lead.locale}
        />
      </section>

      <section className="rounded-xl border border-paper-3 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink/50">
          Státusz
        </h2>
        <StageChangeForm
          leadId={lead.id}
          currentStageId={lead.currentStageId}
          stages={stages}
        />
        {lead.currentStage.key === SYSTEM_STAGE_KEYS.QUESTIONNAIRE_SENDING && (
          <div className="mt-4 border-t border-paper-3 pt-4">
            <ResendQuestionnaireButton leadId={lead.id} />
          </div>
        )}
      </section>

      <section className="rounded-xl border border-paper-3 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink/50">
          Pénzügyi adatok
        </h2>
        <FinancialsForm
          leadId={lead.id}
          dealValueCents={lead.dealValueCents}
          cashCollectedCents={lead.cashCollectedCents}
        />
      </section>

      <section className="rounded-xl border border-paper-3 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink/50">
          Előzmények (audit trail)
        </h2>
        <ol className="flex flex-col gap-3 text-sm">
          {lead.statusHistory.map((entry) => (
            <li
              key={entry.id}
              className="flex flex-col gap-0.5 border-b border-paper-3 pb-3 last:border-0"
            >
              <span>
                {entry.fromStage ? entry.fromStage.label : "Létrehozva"} →{" "}
                <strong>{entry.toStage.label}</strong>
              </span>
              <span className="text-xs text-ink/50">
                {entry.changedAt.toLocaleString("hu-HU")} ·{" "}
                {entry.changedBy?.name ?? "rendszer"}
                {entry.note ? ` · ${entry.note}` : ""}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-xl border border-paper-3 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink/50">
          Kérdőív és foglalás
        </h2>
        {lead.questionnaireResponses.length === 0 &&
        lead.bookings.length === 0 ? (
          <p className="text-sm text-ink/50">
            Még nincs kitöltött kérdőív vagy foglalás ehhez a leadhez.
          </p>
        ) : (
          <div className="flex flex-col gap-4 text-sm">
            {lead.questionnaireResponses.map((response) => (
              <div key={response.id}>
                Kitöltve: {response.submittedAt.toLocaleString("hu-HU")} (
                {response.template.name})
              </div>
            ))}
            {lead.bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between gap-3"
              >
                <span>
                  Discovery call: {booking.startsAt.toLocaleString("hu-HU")} —{" "}
                  {booking.rep.name} ({booking.status})
                </span>
                {booking.status === "CONFIRMED" && (
                  <CancelBookingButton leadId={lead.id} bookingId={booking.id} />
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
