import "server-only";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Profile, Role } from "@/generated/prisma/client";

export type Session = {
  profile: Profile;
};

// Az első bejelentkezéskor még nincs Profile sor a Supabase Auth
// felhasználóhoz — itt hozzuk létre. A FIRST_ADMIN_EMAIL env változóval
// megadott cím automatikusan admin jogot kap az első belépéskor (bootstrap,
// hogy legyen legalább egy admin a rendszerben szerkesztés nélkül); minden
// más felhasználó "sales rep" jogosultsággal indul, amit egy admin később
// módosíthat.
async function ensureProfile(userId: string, email: string): Promise<Profile> {
  const existing = await prisma.profile.findUnique({ where: { id: userId } });
  if (existing) return existing;

  const isFirstAdmin =
    !!process.env.FIRST_ADMIN_EMAIL &&
    email.toLowerCase() === process.env.FIRST_ADMIN_EMAIL.toLowerCase();

  return prisma.profile.create({
    data: {
      id: userId,
      email,
      name: email.split("@")[0],
      role: isFirstAdmin ? "ADMIN" : "SALES_REP",
    },
  });
}

// Data Access Layer belépési pontja: minden CRM route/server action ezt
// hívja a session validálásához — NEM a proxy.ts optimista ellenőrzését.
export async function verifySession(): Promise<Session> {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect("/crm/login");
  }

  const profile = await ensureProfile(user.id, user.email);
  return { profile };
}

export async function requireRole(...roles: Role[]): Promise<Session> {
  const session = await verifySession();
  if (!roles.includes(session.profile.role)) {
    redirect("/crm?error=forbidden");
  }
  return session;
}
