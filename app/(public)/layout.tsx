// Ügyfél-oldali publikus felület (kérdőív kitöltés, időpontfoglalás) —
// szándékosan NEM a belső CRM UI-t (app/crm) és nem is a marketing site
// layoutját (app/(site)) örökli, hanem egy egyszerű, márkázható, saját
// keretet kap (spec 7. pont).
export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="border-b border-paper-3 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <span className="font-display text-lg font-semibold text-ink">
            FlowCore
          </span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        {children}
      </main>
      <footer className="border-t border-paper-3 py-4 text-center text-xs text-ink/40">
        © {new Date().getFullYear()} FlowCore
      </footer>
    </div>
  );
}
