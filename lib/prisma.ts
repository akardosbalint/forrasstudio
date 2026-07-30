import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// Prisma 7 mindig explicit driver adaptert vár (nincs többé automatikus
// datasource url beolvasás a schema.prisma-ból). A connection string a
// Supabase projekt Postgres kapcsolati sztringje (Settings -> Database),
// vagy egy self-hosted Postgres, lásd .env.example.
declare global {
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "[prisma] DATABASE_URL nincs beállítva — lásd .env.example.",
    );
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

// Fejlesztésben (hot reload) egyetlen példányt tartunk meg globálisan, hogy
// ne nyissunk minden módosításnál új connection poolt.
export const prisma = globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}
