"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

/**
 * Route-level error boundary: if a page throws while rendering, the visitor
 * keeps the navigation and footer and gets a way to retry, instead of a
 * blank screen. The error still reaches the console (and Vercel's logs).
 */
export default function PageError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useLanguage();

  useEffect(() => {
    console.error("[PageError]", error);
  }, [error]);

  return (
    <section className="bg-background py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
          {t.errorPage.title}
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">{t.errorPage.body}</p>
        <Button className="mt-8" size="lg" onClick={reset}>
          {t.errorPage.retry}
        </Button>
      </div>
    </section>
  );
}
