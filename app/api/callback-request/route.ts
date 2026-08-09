import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { sendCallbackNotificationEmail } from "@/lib/notifications";

type CallbackRequestPayload = {
  name?: unknown;
  phone?: unknown;
  organization?: unknown;
  email?: unknown;
  message?: unknown;
  source?: unknown;
  consent?: unknown;
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

  if (!name || !phone) {
    return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
  }

  if (!consent) {
    return NextResponse.json({ error: "CONSENT_REQUIRED" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    console.error(
      "[callback-request] Supabase nincs konfigurálva — lásd .env.example ([TODO: Supabase env változók]).",
    );
    return NextResponse.json({ error: "NOT_CONFIGURED" }, { status: 503 });
  }

  const { error } = await supabase.from("callback_requests").insert({
    name,
    phone,
    organization: organization || null,
    email: email || null,
    message: message || null,
    source,
    consent,
  });

  if (error) {
    console.error("[callback-request] Supabase insert error:", error);
    return NextResponse.json({ error: "SAVE_FAILED" }, { status: 500 });
  }

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
