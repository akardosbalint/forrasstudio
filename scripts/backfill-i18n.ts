import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { FALLBACK_EMAIL_TEMPLATES } from "../lib/email/fallbackTemplates";
import { DEFAULT_QUESTIONNAIRE_QUESTIONS } from "../lib/questionnaire/defaultQuestions";

// Egyszeri, idempotens backfill script a HU->EN front-end fordításhoz
// tartozó adatbázis-tartalomhoz, olyan éles adatbázisokhoz, amik már a
// migráció ELŐTT léteztek (tehát a prisma/seed.ts sosem futott le rajtuk
// friss telepítésként). Futtatás: `npx tsx scripts/backfill-i18n.ts`
// (a migrációt — `prisma migrate deploy` — előbb futtasd le).
//
// Amit csinál:
// 1. EmailTemplate: felveszi a hiányzó angol (locale="en") sablon-sorokat
//    a lib/email/fallbackTemplates.ts alapján, anélkül hogy a meglévő
//    (admin által esetleg szerkesztett) magyar sorokhoz hozzányúlna.
// 2. QuestionnaireQuestion: a `label` szövege alapján megpróbálja
//    párosítani a meglévő kérdéseket a beépített alapkérdés-listával
//    (lib/questionnaire/defaultQuestions.ts), és feltölti a hiányzó
//    labelEn/helpTextEn/optionsEn mezőket. Az admin által egyedileg
//    létrehozott (nem beépített) kérdéseknél ez nem tud automatikusan
//    fordítani — ezeket a script kilistázza, kézi fordításra a CRM admin
//    "Kérdőívek" felületén.
// 3. Lead.locale: ezt maga a migráció tölti fel ("hu" default minden
//    meglévő sorra) — itt nincs teendő, csak logoljuk.

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("[backfill-i18n] DATABASE_URL nincs beállítva.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function backfillEmailTemplates() {
  let created = 0;
  for (const [locale, templates] of Object.entries(FALLBACK_EMAIL_TEMPLATES)) {
    for (const [key, template] of Object.entries(templates)) {
      const existing = await prisma.emailTemplate.findUnique({
        where: { key_locale: { key, locale } },
      });
      if (existing) continue;
      await prisma.emailTemplate.create({
        data: {
          key,
          locale,
          name: `${key} (${locale})`,
          subject: template.subject,
          bodyHtml: template.bodyHtml,
          bodyText: template.bodyText,
        },
      });
      created += 1;
      console.log(`[backfill-i18n] Létrehozva: EmailTemplate ${key} (${locale})`);
    }
  }
  console.log(`[backfill-i18n] ${created} új email sablon sor létrehozva.`);
}

async function backfillQuestionnaireQuestions() {
  const translationsByLabel = new Map(
    DEFAULT_QUESTIONNAIRE_QUESTIONS.map((q) => [q.label, q]),
  );

  const questions = await prisma.questionnaireQuestion.findMany({
    where: { labelEn: null },
  });

  let updated = 0;
  const unmatched: string[] = [];

  for (const question of questions) {
    const match = translationsByLabel.get(question.label);
    if (!match) {
      unmatched.push(`${question.id} — "${question.label}"`);
      continue;
    }
    await prisma.questionnaireQuestion.update({
      where: { id: question.id },
      data: {
        labelEn: match.labelEn,
        helpTextEn: "helpTextEn" in match ? match.helpTextEn : null,
        optionsEn: "optionsEn" in match ? match.optionsEn : undefined,
      },
    });
    updated += 1;
  }

  console.log(
    `[backfill-i18n] ${updated} kérdőív-kérdés angol fordítása feltöltve.`,
  );
  if (unmatched.length > 0) {
    console.warn(
      `[backfill-i18n] ${unmatched.length} egyedi (nem beépített) kérdéshez nem talált automatikus fordítást — ezeket kézzel kell lefordítani a CRM admin "Kérdőívek" felületén:`,
    );
    unmatched.forEach((line) => console.warn(`  - ${line}`));
  }
}

async function main() {
  await backfillEmailTemplates();
  await backfillQuestionnaireQuestions();
  console.log(
    "[backfill-i18n] Lead.locale: a migráció már feltöltötte ('hu' default minden meglévő leadre) — nincs további teendő.",
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
