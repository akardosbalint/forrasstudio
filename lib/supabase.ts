import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// [TODO: Supabase env változók] — állítsd be a Vercel / .env.local fájlban:
// NEXT_PUBLIC_SUPABASE_URL és SUPABASE_SERVICE_ROLE_KEY
// Lásd .env.example és supabase/schema.sql.
export function getSupabaseServerClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
