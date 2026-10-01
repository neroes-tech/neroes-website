"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useDocumentTitle, useLanguage } from "@/lib/i18n/LanguageProvider";

/** The 404 page body, in the visitor's language (not-found.tsx is the route entry). */
export function NotFoundContent() {
  const { locale, t } = useLanguage();
  // Unknown URLs have no route of their own: the tab title follows the language here.
  useDocumentTitle(locale === "en" ? `${t.notFound.title} — Neroes` : undefined);

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-background pb-24 pt-36">
      <div className="container mx-auto max-w-xl px-4 text-center md:px-6">
        <h1 className="font-exo text-5xl font-light leading-[1.05] tracking-[-0.04em] text-foreground md:text-6xl">
          {t.notFound.title}
        </h1>
        <p className="mt-6 text-lg font-light leading-relaxed text-muted-foreground">{t.notFound.body}</p>
        <Button asChild size="lg" className="mt-10">
          <Link href="/">{t.notFound.back}</Link>
        </Button>
      </div>
    </section>
  );
}
