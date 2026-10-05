"use client";

import { createContext, startTransition, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

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

/**
 * Keeps the browser-tab title on `title` while mounted (pass undefined for no
 * override). The Portuguese title is the route's metadata, which Next.js can
 * insert or replace after hydration, so it is re-applied whenever a <title>
 * changes; on unmount (e.g. back to PT) the elements it rewrote get their
 * metadata text back.
 */
export function useDocumentTitle(title: string | undefined) {
  useEffect(() => {
    if (!title) return;
    const original = new Map<HTMLTitleElement, string>();
    const apply = () => {
      const el = document.querySelector("title");
      if (!el || el.textContent === title) return;
      original.set(el, el.textContent ?? "");
      el.textContent = title;
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
    return () => {
      observer.disconnect();
      original.forEach((text, el) => {
        if (el.isConnected && el.textContent === title) el.textContent = text;
      });
    };
  }, [title]);
}

// Default is Portuguese; persists the user's choice across visits via
// localStorage, read once on mount (kept out of the initial render so the
// server-rendered PT markup always matches the client's first paint).
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt");
  const pathname = usePathname();

  useEffect(() => {
    const stored = readStoredLocale();
    if (stored) setLocaleState(stored);
  }, []);

  // The document language follows the one on screen (WCAG 3.1.1).
  useEffect(() => {
    document.documentElement.lang = locale === "pt" ? "pt-PT" : "en";
  }, [locale]);

  // Browser-tab title in English on the bilingual routes (PT = route metadata).
  const enTitles: Record<string, string> = { "/": translations.en.meta.home, "/contact": translations.en.meta.contact };
  useDocumentTitle(locale === "en" ? enTitles[pathname] : undefined);

  // A transition: switching re-renders the whole page and reshapes every line
  // of text, which inside the click delayed its paint by 0.3–0.8 s (INP). The
  // click now paints first and the re-render follows, interruptibly.
  const setLocale = useCallback((next: Locale) => {
    storeLocale(next);
    startTransition(() => setLocaleState(next));
  }, []);
  const value = useMemo(() => ({ locale, setLocale, t: translations[locale] }), [locale, setLocale]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
