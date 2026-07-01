"use client";

import { openCookieSettings } from "@/components/CookieConsent";

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className="underline decoration-white/20 hover:text-paper"
    >
      Süti beállítások
    </button>
  );
}
