import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// [TODO: Supabase env változók] — állítsd be a Vercel / .env.local fájlban:
// SUPABASE_URL és SUPABASE_PUBLISHABLE_KEY.
// A publishable key nyilvánosan kiadható (nem service role / secret kulcs),
// az insert-et a supabase/schema.sql-ben definiált RLS policy engedi az
// "anon" szerepkörnek. Lásd .env.example és supabase/schema.sql.
export function getSupabaseServerClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    return null;
  }

  return createClient(url, publishableKey, {
    auth: { persistSession: false },
  });
}
