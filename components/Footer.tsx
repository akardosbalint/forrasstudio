import { CookieSettingsButton } from "@/components/CookieSettingsButton";
import { Wordmark } from "@/components/Wordmark";

const legalLinks = [
  { label: "Adatkezelési tájékoztató", href: "/adatvedelem" },
  { label: "Sütikezelési tájékoztató", href: "/cookie-tajekoztato" },
  { label: "Impresszum", href: "/impresszum" },
];

const socials = [
  {
    label: "Facebook [TODO: link]",
    href: "#",
    path: "M17.5 8.5h-2a1 1 0 0 0-1 1V12h3l-.4 3h-2.6v8h-3v-8H9.5v-3h1.9V9.2C11.4 6.9 12.9 5.5 15 5.5c.9 0 1.7.1 2 .1v2.9Z",
  },
  {
    label: "Instagram [TODO: link]",
    href: "#",
    path: "M8 4h11a4 4 0 0 1 4 4v11a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4Zm5.5 4.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Zm0 2a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7ZM18 7.2a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z",
  },
  {
    label: "LinkedIn [TODO: link]",
    href: "#",
    path: "M6.5 9h3.2v12H6.5V9Zm1.6-5a1.9 1.9 0 1 1 0 3.8 1.9 1.9 0 0 1 0-3.8ZM13 9h3.1v1.6h.1c.4-.8 1.5-1.8 3.2-1.8 3.4 0 4 2.2 4 5.1V21h-3.2v-6.4c0-1.5 0-3.5-2.1-3.5-2.2 0-2.5 1.7-2.5 3.4V21H13V9Z",
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-3 text-paper/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 sm:flex-row sm:items-start sm:justify-between sm:px-8">
        <div>
          <Wordmark className="text-lg" toneClassName="text-paper" />
          <p className="mt-2 text-sm">
            Email:{" "}
            <a href="mailto:akardosbalint@gmail.com" className="underline decoration-white/20 hover:text-paper">
              akardosbalint@gmail.com
            </a>
          </p>
          <p className="mt-1 text-sm">
            Telefon:{" "}
            <a href="tel:[TODO: telefonszám]" className="underline decoration-white/20 hover:text-paper">
              [TODO: telefonszám]
            </a>
          </p>
        </div>

        <div className="flex gap-4">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-paper/60 transition-colors hover:border-spring hover:text-spring"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
                <path d={social.path} />
              </svg>
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-white/5 px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-xs text-paper/40 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} MI Építettük. Minden jog fenntartva.</p>
          <nav aria-label="Jogi dokumentumok" className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
            {legalLinks.map((link) => (
              <a key={link.href} href={link.href} className="underline decoration-white/20 hover:text-paper">
                {link.label}
              </a>
            ))}
            <CookieSettingsButton />
          </nav>
        </div>
      </div>
    </footer>
  );
}
