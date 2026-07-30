import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIX = "/crm";
const AUTH_PAGE = "/crm/login";

// Optimista session-ellenőrzés a proxy.ts-ből (lásd Next.js auth guide):
// csak a cookie-ban lévő JWT-t validálja a Supabase Auth szerverrel szemben,
// és a session cookie-t frissíti/refresheli. A tényleges jogosultság-
// (role-) ellenőrzést minden route/server action saját maga végzi újra
// (lib/auth/rbac.ts) — a proxy csak az "egyáltalán be van-e jelentkezve"
// szintű, gyors átirányításokért felel.
export async function updateSupabaseSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    return response;
  }

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isProtected =
    path.startsWith(PROTECTED_PREFIX) && path !== AUTH_PAGE;

  if (isProtected && !user) {
    const loginUrl = new URL(AUTH_PAGE, request.url);
    loginUrl.searchParams.set("next", path);
    return NextResponse.redirect(loginUrl);
  }

  if (path === AUTH_PAGE && user) {
    return NextResponse.redirect(new URL("/crm", request.url));
  }

  return response;
}
