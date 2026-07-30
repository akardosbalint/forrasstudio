import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { DEFAULT_PIPELINE_STAGES } from "../lib/pipeline/stages";
import { FALLBACK_EMAIL_TEMPLATES } from "../lib/email/fallbackTemplates";

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

  for (const [key, template] of Object.entries(FALLBACK_EMAIL_TEMPLATES)) {
    await prisma.emailTemplate.upsert({
      where: { key },
      update: {},
      create: {
        key,
        name: key,
        subject: template.subject,
        bodyHtml: template.bodyHtml,
        bodyText: template.bodyText,
      },
    });
  }
  console.log(
    `Seeded ${Object.keys(FALLBACK_EMAIL_TEMPLATES).length} email templates.`,
  );
}

const DEFAULT_QUESTIONNAIRE_QUESTIONS = [
  {
    label: "Röviden foglald össze, mit szeretnétek megvalósítani.",
    type: "TEXTAREA" as const,
    required: true,
  },
  {
    label: "Milyen folyamatokat végeztek ma ezen a területen (ha van)?",
    helpText: "Pl. Excel, papír, meglévő szoftver, manuális egyeztetés stb.",
    type: "TEXTAREA" as const,
    required: true,
  },
  {
    label: "Hány fős a csapat, akik majd használják a rendszert?",
    type: "NUMBER" as const,
    required: true,
  },
  {
    label: "Milyen technikai környezetben dolgoztok jelenleg?",
    helpText: "Meglévő rendszerek, integrációk, amikhez kapcsolódnia kell.",
    type: "TEXTAREA" as const,
    required: false,
  },
  {
    label: "Mi a legfontosabb üzleti cél, amit ezzel el szeretnétek érni?",
    type: "TEXTAREA" as const,
    required: true,
  },
  {
    label: "Milyen büdzsé-keretben gondolkodtok?",
    type: "SELECT" as const,
    options: [
      "1-3 millió Ft",
      "3-8 millió Ft",
      "8-15 millió Ft",
      "15+ millió Ft",
      "Még nincs meghatározva",
    ],
    required: true,
  },
  {
    label: "Mikorra szeretnétek élesbe állni?",
    type: "SELECT" as const,
    options: [
      "Minél hamarabb",
      "1-3 hónapon belül",
      "3-6 hónapon belül",
      "Nincs konkrét határidő",
    ],
    required: true,
  },
];

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
