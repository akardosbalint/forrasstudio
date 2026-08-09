import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SYSTEM_STAGE_KEYS } from "@/lib/pipeline/stages";
import { writeAuditLog } from "@/lib/audit/log";
import { sendCallbackNotificationEmail } from "@/lib/notifications";
import { isLocale } from "@/lib/i18n/config";

type CallbackRequestPayload = {
  name?: unknown;
  phone?: unknown;
  organization?: unknown;
  email?: unknown;
  message?: unknown;
  source?: unknown;
  consent?: unknown;
  locale?: unknown;
};

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: CallbackRequestPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const name = asTrimmedString(body.name);
  const phone = asTrimmedString(body.phone);
  const organization = asTrimmedString(body.organization);
  const email = asTrimmedString(body.email);
  const message = asTrimmedString(body.message);
  const source = asTrimmedString(body.source) || "unknown";
  const consent = body.consent === true;
  const localeRaw = asTrimmedString(body.locale);
  const locale = isLocale(localeRaw) ? localeRaw : "hu";

  if (!name || !phone) {
    return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
  }

  if (!consent) {
    return NextResponse.json({ error: "CONSENT_REQUIRED" }, { status: 400 });
  }

  // A publikus form beküldése a CRM pipeline-jában, "Visszahívásra vár"
  // stádiumban induló Lead-et hoz létre — ugyanaz a modell, amit az admin
  // felület manuális lead-felvétele is használ (lásd
  // app/crm/(dashboard)/leads/actions.ts createLead), hogy a form
  // ténylegesen megjelenjen a CRM-ben, ne csak egy elkülönített
  // (korábban semmi által nem olvasott) Supabase táblába írjon.
  const initialStage = await prisma.pipelineStage.findUnique({
    where: { key: SYSTEM_STAGE_KEYS.CALLBACK_PENDING },
  });

  if (!initialStage) {
    console.error(
      "[callback-request] Pipeline nincs beüzemelve (hiányzó callback_pending stádium) — futtasd le a seed scriptet.",
    );
    return NextResponse.json({ error: "NOT_CONFIGURED" }, { status: 503 });
  }

  let leadId: string;
  try {
    const lead = await prisma.lead.create({
      data: {
        name,
        phone,
        company: organization || null,
        email: email || null,
        message: message || null,
        source,
        currentStageId: initialStage.id,
        locale,
      },
    });
    leadId = lead.id;

    await prisma.statusHistory.create({
      data: {
        leadId: lead.id,
        toStageId: initialStage.id,
        note: "Publikus visszahívás-kérés form.",
      },
    });
  } catch (error) {
    console.error("[callback-request] Lead insert error:", error);
    return NextResponse.json({ error: "SAVE_FAILED" }, { status: 500 });
  }

  await writeAuditLog({
    userId: null,
    entityType: "Lead",
    entityId: leadId,
    action: "lead.created",
    metadata: { source, consent: true },
  });

  // A lead már elmentve — az email-értesítés esetleges hibája nem hiúsíthatja
  // meg a sikeres választ.
  await sendCallbackNotificationEmail({
    name,
    phone,
    organization,
    email,
    message,
    source,
  }).catch((notificationError) => {
    console.error(
      "[callback-request] Notification error:",
      notificationError,
    );
  });

  return NextResponse.json({ ok: true });
}
