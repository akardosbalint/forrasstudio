import { Suspense } from "react";
import type { Metadata } from "next";
import { Wordmark } from "@/components/Wordmark";
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
      <div className="bg-gradient-brand w-full max-w-sm rounded-2xl p-px shadow-xl shadow-amber/10">
        <div className="rounded-[15px] bg-white p-8">
          <h1 className="mb-1 flex items-center gap-2 text-xl">
            <Wordmark toneClassName="text-ink" />
            <span className="text-ink/40">CRM</span>
          </h1>
          <p className="mb-6 text-sm text-ink/60">
            Add meg az email címed, és küldünk egy bejelentkező linket.
          </p>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
