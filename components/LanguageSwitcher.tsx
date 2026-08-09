"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";

type LanguageSwitcherProps = {
  lang: Locale;
  labels: { hu: string; en: string; ariaLabel: string };
  className?: string;
};

function swapLocale(pathname: string, target: Locale): string {
  const segments = pathname.split("/");
  // segments[0] is "" (leading slash), segments[1] is the current locale.
  segments[1] = target;
  return segments.join("/") || `/${target}`;
}

export function LanguageSwitcher({ lang, labels, className }: LanguageSwitcherProps) {
  const pathname = usePathname() ?? `/${lang}`;

  return (
    <div
      aria-label={labels.ariaLabel}
      className={`inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wide ${className ?? ""}`}
    >
      {locales.map((locale, index) => (
        <span key={locale} className="flex items-center gap-1">
          {index > 0 && <span aria-hidden="true" className="opacity-40">/</span>}
          {locale === lang ? (
            <span aria-current="true" className="font-semibold opacity-100">
              {labels[locale]}
            </span>
          ) : (
            <Link
              href={swapLocale(pathname, locale)}
              className="opacity-60 transition-opacity duration-200 hover:opacity-100"
            >
              {labels[locale]}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
}
