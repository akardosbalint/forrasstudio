"use client";

import { openCookieSettings } from "@/components/CookieConsent";

type CookieSettingsButtonProps = {
  label: string;
};

export function CookieSettingsButton({ label }: CookieSettingsButtonProps) {
  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className="underline decoration-white/20 hover:text-paper"
    >
      {label}
    </button>
  );
}
