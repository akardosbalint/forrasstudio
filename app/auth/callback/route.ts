import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// A magic link emailben kiküldött link ide mutat vissza (emailRedirectTo,
// lásd LoginForm.tsx) — a Supabase Auth a linkre kattintás után egy
// egyszer-használatos `code` paraméterrel irányít ide, amit itt váltunk be
// valódi munkamenetre (PKCE code exchange).
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/crm";
  // Csak relatív, saját domain-en belüli útvonalra irányítunk tovább, hogy a
  // `next` paraméter ne legyen felhasználható nyílt redirect-re.
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/crm";

  if (code) {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/crm/login?error=auth`);
}
