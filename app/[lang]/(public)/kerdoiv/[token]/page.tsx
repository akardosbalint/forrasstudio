import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/dictionaries";
import { QuestionnaireForm } from "./QuestionnaireForm";

export default async function QuestionnairePage({
  params,
}: {
  params: Promise<{ lang: string; token: string }>;
}) {
  const { lang, token } = await params;
  if (!isLocale(lang)) {
    notFound();
  }
  const dict = await getDictionary(lang);
  const t = dict.flows.questionnaire;

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
          {t.invalidLink.heading}
        </h1>
        <p className="text-sm text-ink/60">{t.invalidLink.body}</p>
      </div>
    );
  }

  if (link.usedAt) {
    return (
      <div className="rounded-xl border border-paper-3 bg-white p-6 text-center">
        <h1 className="mb-2 font-display text-lg font-semibold">
          {t.alreadySubmitted.heading}
        </h1>
        <p className="text-sm text-ink/60">{t.alreadySubmitted.body}</p>
      </div>
    );
  }

  if (link.expiresAt < new Date()) {
    return (
      <div className="rounded-xl border border-paper-3 bg-white p-6 text-center">
        <h1 className="mb-2 font-display text-lg font-semibold">
          {t.expired.heading}
        </h1>
        <p className="text-sm text-ink/60">{t.expired.body}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-xl font-semibold">{t.heading}</h1>
        <p className="mt-1 text-sm text-ink/60">{t.greeting(link.lead.name)}</p>
      </div>
      <QuestionnaireForm
        token={token}
        lang={lang}
        questions={link.template.questions}
      />
    </div>
  );
}
