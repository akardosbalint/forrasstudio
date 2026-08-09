"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth/rbac";
import { writeAuditLog } from "@/lib/audit/log";

const updateProfileNameSchema = z.object({
  name: z.string().trim().min(1, "A név megadása kötelező."),
});

export type UpdateProfileNameState = { error?: string } | undefined;

export async function updateProfileName(
  _prevState: UpdateProfileNameState,
  formData: FormData,
): Promise<UpdateProfileNameState> {
  const { profile } = await verifySession();

  const parsed = updateProfileNameSchema.safeParse({
    name: formData.get("name"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Érvénytelen adat." };
  }

  await prisma.profile.update({
    where: { id: profile.id },
    data: { name: parsed.data.name },
  });

  await writeAuditLog({
    userId: profile.id,
    entityType: "Profile",
    entityId: profile.id,
    action: "profile.name_updated",
    metadata: { name: parsed.data.name },
  });

  revalidatePath("/crm/settings/profile");
  revalidatePath("/crm", "layout");
  return undefined;
}
