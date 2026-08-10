import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/dictionaries";

type CaseStudyHeaderProps = {
  lang: Locale;
  backLabel: string;
  langSwitcherLabels: Dictionary["common"]["languageSwitcher"];
};

export function CaseStudyHeader({ lang, backLabel, langSwitcherLabels }: CaseStudyHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/95 backdrop-blur supports-[backdrop-filter]:bg-ink/80">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        <Link
          href={`/${lang}#referenciak`}
          className="group flex items-center gap-2 font-sans text-sm text-paper/70 transition-colors duration-200 hover:text-paper"
        >
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          >
            ←
          </span>
          {backLabel}
        </Link>

        <div className="flex items-center gap-5">
          <Link
            href={`/${lang}`}
            className="font-display text-base font-semibold tracking-tight text-paper transition-transform duration-300 hover:scale-[1.02]"
          >
            FlowCore
          </Link>
          <LanguageSwitcher lang={lang} labels={langSwitcherLabels} className="text-paper/70" />
        </div>
      </div>
    </header>
  );
}
