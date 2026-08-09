import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { DEFAULT_PIPELINE_STAGES } from "../lib/pipeline/stages";
import { FALLBACK_EMAIL_TEMPLATES } from "../lib/email/fallbackTemplates";
import { DEFAULT_QUESTIONNAIRE_QUESTIONS } from "../lib/questionnaire/defaultQuestions";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("[seed] DATABASE_URL nincs beállítva.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  for (const stage of DEFAULT_PIPELINE_STAGES) {
    await prisma.pipelineStage.upsert({
      where: { key: stage.key },
      update: {
        label: stage.label,
        order: stage.order,
        color: stage.color,
        isSystem: stage.isSystem,
        isTerminal: stage.isTerminal,
      },
      create: stage,
    });
  }
  console.log(`Seeded ${DEFAULT_PIPELINE_STAGES.length} pipeline stages.`);

  const existingTemplate = await prisma.questionnaireTemplate.findFirst({
    where: { isActive: true },
  });
  if (!existingTemplate) {
    await prisma.questionnaireTemplate.create({
      data: {
        name: "Rendszertervezési kérdőív (alap)",
        isActive: true,
        questions: {
          create: DEFAULT_QUESTIONNAIRE_QUESTIONS.map((q, index) => ({
            ...q,
            order: index + 1,
          })),
        },
      },
    });
    console.log("Seeded default questionnaire template + questions.");
  }

  let emailTemplateCount = 0;
  for (const [locale, templates] of Object.entries(FALLBACK_EMAIL_TEMPLATES)) {
    for (const [key, template] of Object.entries(templates)) {
      await prisma.emailTemplate.upsert({
        where: { key_locale: { key, locale } },
        update: {},
        create: {
          key,
          locale,
          name: `${key} (${locale})`,
          subject: template.subject,
          bodyHtml: template.bodyHtml,
          bodyText: template.bodyText,
        },
      });
      emailTemplateCount += 1;
    }
  }
  console.log(`Seeded ${emailTemplateCount} email templates.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
