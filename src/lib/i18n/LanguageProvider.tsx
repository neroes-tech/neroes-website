"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { translations, type Locale, type Translations } from "@/lib/i18n/translations";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "neroes-locale";

// localStorage throws when storage is blocked (Safari private mode, cookies
// disabled, some embedded browsers). The language choice is a convenience:
// without storage the site simply starts in Portuguese.
function readStoredLocale(): Locale | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "pt" || stored === "en" ? stored : null;
  } catch {
    return null;
  }
}

function storeLocale(locale: Locale) {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Not persisted; the switch still applies to this visit.
  }
}

// Default is Portuguese; persists the user's choice across visits via
// localStorage, read once on mount (kept out of the initial render so the
// server-rendered PT markup always matches the client's first paint).
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt");

  useEffect(() => {
    const stored = readStoredLocale();
    if (stored) setLocaleState(stored);
  }, []);

  // The document language follows the one on screen (WCAG 3.1.1).
  useEffect(() => {
    document.documentElement.lang = locale === "pt" ? "pt-PT" : "en";
  }, [locale]);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    storeLocale(next);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
