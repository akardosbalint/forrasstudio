import "server-only";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Prisma } from "@/generated/prisma/client";
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
// A layout és a page egyszerre hívja meg a verifySession()-t első
// belépéskor, két párhuzamos kérés versenyezhetne itt: mindkettő
// findUnique-kor még nem lát profilt, majd mindkettő create-elni próbál.
// A vesztes kérés P2002 unique constraint hibát kap az id-n — ilyenkor
// egyszerűen újra lekérdezzük a közben létrejött sort, ahelyett hogy a
// hibát a hívóig engednénk felbuborékolni (500-as oldalbetöltési hiba
// lenne belőle). Megjegyzés: upsert() itt NEM lenne atomi — a Prisma 7
// driver adapter query engine-je client-oldali check-then-write-ként
// hajtja végre, nem egyetlen INSERT ... ON CONFLICT SQL utasításként.
async function ensureProfile(userId: string, email: string): Promise<Profile> {
  const existing = await prisma.profile.findUnique({ where: { id: userId } });
  if (existing) return existing;

  const isFirstAdmin =
    !!process.env.FIRST_ADMIN_EMAIL &&
    email.toLowerCase() === process.env.FIRST_ADMIN_EMAIL.toLowerCase();

  try {
    return await prisma.profile.create({
      data: {
        id: userId,
        email,
        name: email.split("@")[0],
        role: isFirstAdmin ? "ADMIN" : "SALES_REP",
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const winner = await prisma.profile.findUnique({ where: { id: userId } });
      if (winner) return winner;
    }
    throw error;
  }
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
