import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

type WriteAuditLogParams = {
  userId: string | null;
  entityType: string;
  entityId: string;
  action: string;
  metadata?: Prisma.InputJsonValue;
};

// Központi audit-log író: minden státuszváltást és adatmódosítást ide
// naplózunk (ki, mikor, mit — spec 2. pont). Ne hívd közvetlenül a
// prisma.auditLog.create-et máshonnan, hogy a formátum egységes maradjon.
export async function writeAuditLog({
  userId,
  entityType,
  entityId,
  action,
  metadata,
}: WriteAuditLogParams) {
  await prisma.auditLog.create({
    data: {
      userId,
      entityType,
      entityId,
      action,
      metadata,
    },
  });
}
