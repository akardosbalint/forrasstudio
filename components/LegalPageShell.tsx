import type { ReactNode } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import type { Dictionary } from "@/dictionaries";
import type { Locale } from "@/lib/i18n/config";

type LegalPageShellProps = {
  lang: Locale;
  navDict: Dictionary["site"]["nav"];
  footerDict: Dictionary["site"]["footer"];
  languageSwitcherLabels: Dictionary["common"]["languageSwitcher"];
  cookieSettingsLabel: string;
  eyebrow: string;
  title: string;
  updated: string;
  updatedLabel: string;
  children: ReactNode;
};

export function LegalPageShell({
  lang,
  navDict,
  footerDict,
  languageSwitcherLabels,
  cookieSettingsLabel,
  eyebrow,
  title,
  updated,
  updatedLabel,
  children,
}: LegalPageShellProps) {
  return (
    <>
      <Nav lang={lang} dict={navDict} languageSwitcherLabels={languageSwitcherLabels} />
      <main className="flex-1 bg-paper">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-spring">
            {eyebrow}
          </p>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-ink/50">
            {updatedLabel}
            {updated}
          </p>

          <div className="mt-10">{children}</div>
        </div>
      </main>
      <Footer
        lang={lang}
        dict={footerDict}
        languageSwitcherLabels={languageSwitcherLabels}
        cookieSettingsLabel={cookieSettingsLabel}
      />
    </>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-8 first:mt-0">
      <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-ink/75 [&_a]:underline [&_a]:decoration-ink/20 [&_a]:underline-offset-2 [&_a:hover]:text-ink [&_a:hover]:decoration-spring [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
