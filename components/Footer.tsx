import { CookieSettingsButton } from "@/components/CookieSettingsButton";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/dictionaries";

type FooterProps = {
  lang: Locale;
  dict: Dictionary["site"]["footer"];
  cookieSettingsDict: Dictionary["site"]["cookieSettingsButton"];
  langSwitcherLabels: Dictionary["common"]["languageSwitcher"];
};

export function Footer({ lang, dict, cookieSettingsDict, langSwitcherLabels }: FooterProps) {
  const { socials, legalLinks } = dict;
  return (
    <footer className="border-t border-white/10 bg-ink-3 text-paper/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 sm:flex-row sm:items-start sm:justify-between sm:px-8">
        <div>
          <p className="font-display text-lg font-semibold text-paper">{dict.brand}</p>
          <p className="mt-2 text-sm">
            {dict.emailLabel}{" "}
            <a href="mailto:balint@miepitettuk.hu" className="underline decoration-white/20 hover:text-paper">
              balint@miepitettuk.hu
            </a>
          </p>
        </div>

        <div className="flex items-center gap-4">
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
          <LanguageSwitcher lang={lang} labels={langSwitcherLabels} />
        </div>
      </div>

      <div className="border-t border-white/5 px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-xs text-paper/40 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {dict.brand}. {dict.copyrightSuffix}</p>
          <nav aria-label={dict.legalNavAriaLabel} className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
            {legalLinks.map((link) => (
              <a key={link.href} href={`/${lang}${link.href}`} className="underline decoration-white/20 hover:text-paper">
                {link.label}
              </a>
            ))}
            <CookieSettingsButton dict={cookieSettingsDict} />
          </nav>
        </div>
      </div>
    </footer>
  );
}
