"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth/rbac";
import { writeAuditLog } from "@/lib/audit/log";
import { getOAuthClient } from "@/lib/google/oauth";
import { decryptSecret } from "@/lib/crypto/secretBox";

const WEEKDAYS = [1, 2, 3, 4, 5] as const;
const WEEKDAY_LABELS: Record<number, string> = {
  1: "Hétfő",
  2: "Kedd",
  3: "Szerda",
  4: "Csütörtök",
  5: "Péntek",
};

const HHMM_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const BUSINESS_START_MINUTES = 9 * 60;
const BUSINESS_END_MINUTES = 18 * 60;

function parseHHmmMinutes(value: string): number | null {
  if (!HHMM_PATTERN.test(value)) return null;
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
}

export async function disconnectGoogleCalendar(): Promise<void> {
  const { profile } = await verifySession();

  const connection = await prisma.googleCalendarConnection.findUnique({
    where: { repId: profile.id },
  });

  if (connection) {
    try {
      const oauthClient = getOAuthClient();
      await oauthClient.revokeToken(decryptSecret(connection.refreshTokenEnc));
    } catch (error) {
      // Best-effort — ha a Google oldali revoke hibázik, a lokális
      // kapcsolatot akkor is töröljük, hogy a rendszer ne próbálja tovább
      // használni az (esetleg már érvénytelen) tokent.
      console.error("[google-disconnect] revoke error:", error);
    }
    await prisma.googleCalendarConnection.delete({ where: { repId: profile.id } });
  }

  await writeAuditLog({
    userId: profile.id,
    entityType: "GoogleCalendarConnection",
    entityId: profile.id,
    action: "google_calendar.disconnected",
  });

  revalidatePath("/crm/settings/calendar");
}

export type SaveAvailabilityState = { error?: string; success?: boolean } | undefined;

export async function saveRepAvailability(
  _prevState: SaveAvailabilityState,
  formData: FormData,
): Promise<SaveAvailabilityState> {
  const { profile } = await verifySession();

  const rows: { weekday: number; startTime: string; endTime: string }[] = [];
  for (const weekday of WEEKDAYS) {
    const enabled = formData.get(`enabled-${weekday}`) === "on";
    if (!enabled) continue;
    const startTime = String(formData.get(`start-${weekday}`) ?? "09:00");
    const endTime = String(formData.get(`end-${weekday}`) ?? "18:00");

    const startMinutes = parseHHmmMinutes(startTime);
    const endMinutes = parseHHmmMinutes(endTime);
    const dayLabel = WEEKDAY_LABELS[weekday];

    if (startMinutes === null || endMinutes === null) {
      return { error: `${dayLabel}: érvénytelen időformátum.` };
    }
    if (
      startMinutes < BUSINESS_START_MINUTES ||
      endMinutes > BUSINESS_END_MINUTES
    ) {
      return {
        error: `${dayLabel}: a sávnak a globális 9:00-18:00 kereten belül kell lennie.`,
      };
    }
    if (startMinutes >= endMinutes) {
      return {
        error: `${dayLabel}: a kezdő időpontnak a záró időpont előtt kell lennie.`,
      };
    }

    rows.push({ weekday, startTime, endTime });
  }

  await prisma.$transaction([
    prisma.repAvailability.deleteMany({ where: { repId: profile.id } }),
    ...rows.map((row) =>
      prisma.repAvailability.create({
        data: { repId: profile.id, ...row },
      }),
    ),
  ]);

  await writeAuditLog({
    userId: profile.id,
    entityType: "RepAvailability",
    entityId: profile.id,
    action: "rep_availability.updated",
    metadata: { rows },
  });

  revalidatePath("/crm/settings/calendar");
  return { success: true };
}
