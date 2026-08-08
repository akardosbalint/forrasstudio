"use client";

import { openCookieSettings } from "@/components/CookieConsent";
import type { Dictionary } from "@/dictionaries";

type CookieSettingsButtonProps = {
  dict: Dictionary["site"]["cookieSettingsButton"];
};

export function CookieSettingsButton({ dict }: CookieSettingsButtonProps) {
  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className="underline decoration-white/20 hover:text-paper"
    >
      {dict.label}
    </button>
  );
}
