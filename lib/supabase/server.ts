import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Szerver-oldali (Server Component / Route Handler / Server Action) Supabase
// kliens, ami a bejelentkezési session-t a kérés cookie-jaiból olvassa. Az
// auth.getUser() mindig szerveroldalon validálja a JWT-t a Supabase Auth
// szerverrel szemben — ne a getSession()-t használd jogosultság-ellenőrzésre.
export async function getSupabaseServerClient() {
  const cookieStore = await cookies();
  const url = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "[supabase] SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY nincs beállítva — lásd .env.example.",
    );
  }

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // A `setAll` Server Component-ből hívva nem tud cookie-t írni —
          // ez csak akkor gond, ha nincs proxy.ts, ami a session-t frissíti.
        }
      },
    },
  });
}
