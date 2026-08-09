"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/dictionaries";
import type { Locale } from "@/lib/i18n/config";

const STORAGE_KEY = "forras-studio-cookie-consent";
const REOPEN_EVENT = "forras-studio-open-cookie-settings";

type CookieConsentProps = {
  lang: Locale;
  dict: Dictionary["site"]["cookieConsent"];
};

export function CookieConsent({ lang, dict }: CookieConsentProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // localStorage is unavailable during SSR, so the initial visibility can't
    // be determined until after mount without causing a hydration mismatch.
    if (!localStorage.getItem(STORAGE_KEY)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
    }

    function handleReopen() {
      setVisible(true);
    }

    window.addEventListener(REOPEN_EVENT, handleReopen);
    return () => window.removeEventListener(REOPEN_EVENT, handleReopen);
  }, []);

  function choose(value: "accepted" | "rejected") {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-label={dict.ariaLabel}
      className="slide-up-in fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-ink/98 px-5 py-5 backdrop-blur sm:px-8"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-paper/80">
          {dict.message.prefix}
          <a
            href={`/${lang}/cookie-tajekoztato`}
            className="underline decoration-paper/30 hover:text-paper hover:decoration-spring"
          >
            {dict.message.linkLabel}
          </a>
          {dict.message.suffix}
        </p>
        <div className="flex flex-shrink-0 gap-3">
          <button
            type="button"
            onClick={() => choose("rejected")}
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-paper/80 transition-all duration-200 hover:border-paper/40 hover:text-paper active:scale-95"
          >
            {dict.rejectLabel}
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="btn-shine bg-gradient-brand rounded-full px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-amber/25 active:scale-95"
          >
            {dict.acceptLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(REOPEN_EVENT));
}
