"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

// Inline SVGs instead of flag emoji: Windows' Segoe UI Emoji font has never
// rendered regional-indicator flag sequences as actual flags — it falls
// back to showing the plain two-letter code (confirmed: 🇵🇹/🇬🇧 rendered as
// literal "PT"/"GB" text). SVGs render identically on every OS.
function FlagPT() {
  return (
    <svg viewBox="0 0 20 14" width="20" height="14" aria-hidden="true" className="rounded-[2px]">
      <rect width="20" height="14" fill="#FF0000" />
      <rect width="8" height="14" fill="#046A38" />
      <circle cx="8" cy="7" r="2.6" fill="#FFCC00" stroke="#FFFFFF" strokeWidth="0.4" />
    </svg>
  );
}

function FlagGB() {
  return (
    <svg viewBox="0 0 20 14" width="20" height="14" aria-hidden="true" className="rounded-[2px]">
      <rect width="20" height="14" fill="#00247D" />
      <path d="M0,0 L20,14 M20,0 L0,14" stroke="#FFFFFF" strokeWidth="2.8" />
      <path d="M0,0 L20,14 M20,0 L0,14" stroke="#CF142B" strokeWidth="1" />
      <path d="M10,0 V14 M0,7 H20" stroke="#FFFFFF" strokeWidth="4.6" />
      <path d="M10,0 V14 M0,7 H20" stroke="#CF142B" strokeWidth="2.6" />
    </svg>
  );
}

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div role="group" aria-label="Selecionar idioma / Select language" className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => setLocale("pt")}
        aria-pressed={locale === "pt"}
        aria-label="Português"
        className={cn(
          "rounded-sm transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue",
          locale === "pt" ? "opacity-100" : "opacity-45 hover:opacity-80",
        )}
      >
        <FlagPT />
      </button>
      <span aria-hidden="true" className="text-border">
        |
      </span>
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        aria-label="English"
        className={cn(
          "rounded-sm transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue",
          locale === "en" ? "opacity-100" : "opacity-45 hover:opacity-80",
        )}
      >
        <FlagGB />
      </button>
    </div>
  );
}
