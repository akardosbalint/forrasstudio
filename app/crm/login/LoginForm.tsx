"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// Ha az email cím nincs a Supabase Auth-ban (shouldCreateUser: false miatt
// ez nem hoz létre új usert), a hibaüzenetet szándékosan elnyeljük — így
// kívülről nem deríthető ki, hogy egy adott email cím szerepel-e a
// rendszerben (user enumeration elleni védelem).
const SILENT_ERROR_CODES = new Set([
  "user_not_found",
  "signup_disabled",
  "otp_disabled",
]);

export function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "auth"
      ? "A bejelentkező link lejárt vagy érvénytelen, kérj egy újat."
      : null,
  );
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const supabase = getSupabaseBrowserClient();
      const next = searchParams.get("next") || "/crm";
      // A NEXT_PUBLIC_APP_URL-t részesítjük előnyben window.location.origin
      // helyett — utóbbi a böngésző aktuális hostját adná vissza, ami egy
      // Vercel preview deployment URL-je is lehet; egy ilyen deployment
      // idővel eltűnik, és a rá mutató magic link "DEPLOYMENT_NOT_FOUND"
      // 404-et adna. Az env var hiányában (pl. helyi fejlesztésben) marad a
      // window.location.origin fallback.
      const redirectTo = new URL(
        "/auth/callback",
        process.env.NEXT_PUBLIC_APP_URL || window.location.origin,
      );
      redirectTo.searchParams.set("next", next);

      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: redirectTo.toString(),
        },
      });

      if (signInError && !SILENT_ERROR_CODES.has(signInError.code ?? "")) {
        setError("Hiba történt a link küldése közben, próbáld újra később.");
        return;
      }

      setSent(true);
    });
  }

  if (sent) {
    return (
      <p className="text-sm text-ink/70">
        Ha ez az email cím szerepel a rendszerben, hamarosan kapsz egy
        bejelentkező linket — nézd meg a postaládád (és a spam mappát is).
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-lg border border-paper-3 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brook"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper transition-opacity disabled:opacity-60"
      >
        {isPending ? "Küldés..." : "Bejelentkező link küldése"}
      </button>
    </form>
  );
}
