import { notFound } from "next/navigation";
import { Wordmark } from "@/components/Wordmark";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/dictionaries";

// Ügyfél-oldali publikus felület (kérdőív kitöltés, időpontfoglalás) —
// szándékosan NEM a belső CRM UI-t (app/crm) és nem is a marketing site
// layoutját (app/(site)) örökli, hanem egy egyszerű, márkázható, saját
// keretet kap (spec 7. pont).
export default async function PublicLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="border-b border-paper-3 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <Wordmark className="text-lg" toneClassName="text-ink" />
          <LanguageSwitcher lang={lang} labels={dict.common.languageSwitcher} />
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        {children}
      </main>
      <footer className="border-t border-paper-3 py-4 text-center text-xs text-ink/40">
        © {new Date().getFullYear()} MI Építettük
      </footer>
    </div>
  );
}
