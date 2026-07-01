import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

type CallbackRequestPayload = {
  name?: unknown;
  phone?: unknown;
  organization?: unknown;
  email?: unknown;
  message?: unknown;
  source?: unknown;
};

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: CallbackRequestPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Érvénytelen kérés formátum." },
      { status: 400 },
    );
  }

  const name = asTrimmedString(body.name);
  const phone = asTrimmedString(body.phone);
  const organization = asTrimmedString(body.organization);
  const email = asTrimmedString(body.email);
  const message = asTrimmedString(body.message);
  const source = asTrimmedString(body.source) || "unknown";

  if (!name || !phone) {
    return NextResponse.json(
      { error: "A név és a telefonszám megadása kötelező." },
      { status: 400 },
    );
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    console.error(
      "[callback-request] Supabase nincs konfigurálva — lásd .env.example ([TODO: Supabase env változók]).",
    );
    return NextResponse.json(
      {
        error:
          "A visszahívás-kérések fogadása jelenleg nincs beüzemelve. Kérjük, próbáld újra később.",
      },
      { status: 503 },
    );
  }

  const { error } = await supabase.from("callback_requests").insert({
    name,
    phone,
    organization: organization || null,
    email: email || null,
    message: message || null,
    source,
  });

  if (error) {
    console.error("[callback-request] Supabase insert error:", error);
    return NextResponse.json(
      { error: "Nem sikerült elmenteni a kérésed. Kérjük, próbáld újra." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
