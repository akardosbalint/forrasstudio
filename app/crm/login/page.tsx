import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Bejelentkezés — MI Építettük CRM",
};

// A middleware (proxy.ts) session-állapot alapján feltételesen átirányít
// erről az oldalról (lásd updateSupabaseSession) — statikusan/edge-cache-elve
// kiszolgálva ez a redirect-logika ütközhet a cache-elt HTML-lel, ezért ezt
// az oldalt mindig dinamikusan, cache nélkül kell renderelni.
export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm rounded-2xl border border-paper-3 bg-white p-8 shadow-sm">
        <h1 className="mb-1 font-display text-xl font-semibold text-ink">
          MI Építettük CRM
        </h1>
        <p className="mb-6 text-sm text-ink/60">
          Add meg az email címed, és küldünk egy bejelentkező linket.
        </p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
