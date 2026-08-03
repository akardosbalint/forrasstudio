import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Bejelentkezés — FlowCore CRM",
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
          FlowCore CRM
        </h1>
        <p className="mb-6 text-sm text-ink/60">
          Jelentkezz be a belső sales rendszerbe.
        </p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
