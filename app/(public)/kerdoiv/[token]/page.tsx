import { prisma } from "@/lib/prisma";
import { QuestionnaireForm } from "./QuestionnaireForm";

export default async function QuestionnairePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const link = await prisma.questionnaireLink.findUnique({
    where: { token },
    include: {
      lead: true,
      template: { include: { questions: { orderBy: { order: "asc" } } } },
    },
  });

  if (!link) {
    return (
      <div className="rounded-xl border border-paper-3 bg-white p-6 text-center">
        <h1 className="mb-2 font-display text-lg font-semibold">
          Érvénytelen link
        </h1>
        <p className="text-sm text-ink/60">
          Ez a kérdőív-link nem létezik. Ha hibát találtál, keresd a
          kapcsolattartódat.
        </p>
      </div>
    );
  }

  if (link.usedAt) {
    return (
      <div className="rounded-xl border border-paper-3 bg-white p-6 text-center">
        <h1 className="mb-2 font-display text-lg font-semibold">
          Ezt a kérdőívet már kitöltötted
        </h1>
        <p className="text-sm text-ink/60">
          A foglalási linket emailben küldtük ki a kitöltés után.
        </p>
      </div>
    );
  }

  if (link.expiresAt < new Date()) {
    return (
      <div className="rounded-xl border border-paper-3 bg-white p-6 text-center">
        <h1 className="mb-2 font-display text-lg font-semibold">
          Ez a link már lejárt
        </h1>
        <p className="text-sm text-ink/60">
          Keresd a kapcsolattartódat egy új link kiküldéséhez.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-xl font-semibold">
          Rendszertervezési kérdőív
        </h1>
        <p className="mt-1 text-sm text-ink/60">
          Kedves {link.lead.name}! A discovery call előkészítéséhez kérjük,
          töltsd ki az alábbi kérdéseket.
        </p>
      </div>
      <QuestionnaireForm token={token} questions={link.template.questions} />
    </div>
  );
}
