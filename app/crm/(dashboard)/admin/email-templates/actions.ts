"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/rbac";
import { writeAuditLog } from "@/lib/audit/log";

export type FormState = { error?: string; success?: boolean } | undefined;

export async function updateEmailTemplate(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const { profile } = await requireRole("ADMIN");

  const key = String(formData.get("key") ?? "");
  const subject = String(formData.get("subject") ?? "").trim();
  const bodyHtml = String(formData.get("bodyHtml") ?? "");
  const bodyText = String(formData.get("bodyText") ?? "");

  if (!key || !subject || !bodyHtml || !bodyText) {
    return { error: "Minden mező kitöltése kötelező." };
  }

  await prisma.emailTemplate.upsert({
    where: { key },
    update: { subject, bodyHtml, bodyText },
    create: { key, name: key, subject, bodyHtml, bodyText },
  });

  await writeAuditLog({
    userId: profile.id,
    entityType: "EmailTemplate",
    entityId: key,
    action: "email_template.updated",
  });

  revalidatePath(`/crm/admin/email-templates/${key}`);
  revalidatePath("/crm/admin/email-templates");
  return { success: true };
}
