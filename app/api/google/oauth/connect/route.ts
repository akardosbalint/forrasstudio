import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/rbac";
import { buildAuthUrl } from "@/lib/google/oauth";

export async function GET(request: Request) {
  const { profile } = await verifySession();

  try {
    const url = buildAuthUrl(profile.id);
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("[google-oauth-connect]", error);
    return NextResponse.redirect(
      new URL(
        "/crm/settings/calendar?error=not_configured",
        request.url,
      ),
    );
  }
}
