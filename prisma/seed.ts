import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { DEFAULT_PIPELINE_STAGES } from "../lib/pipeline/stages";

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
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
