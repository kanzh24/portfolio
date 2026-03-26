"use client";

import { useLocale } from "./LocaleProvider";
import type { Locale } from "@/lib/i18n";

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  const cycle = (l: Locale) => setLocale(l);

  return (
    <div
      className="flex rounded-sm border border-outline-variant/30 overflow-hidden glass-card p-0.5"
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => cycle("en")}
        className={`px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors ${
          locale === "en"
            ? "bg-primary text-on-primary"
            : "lang-toggle-inactive"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => cycle("vi")}
        className={`px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors ${
          locale === "vi"
            ? "bg-primary text-on-primary"
            : "lang-toggle-inactive"
        }`}
      >
        VI
      </button>
    </div>
  );
}
