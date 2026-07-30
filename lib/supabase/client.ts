import { createBrowserClient } from "@supabase/ssr";

// Böngésző-oldali Supabase kliens (login form, jelszó-visszaállítás stb.).
export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY nincs beállítva — lásd .env.example.",
    );
  }

  return createBrowserClient(url, publishableKey);
}
