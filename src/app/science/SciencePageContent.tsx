"use client";

import Link from "next/link";

import { Evidence } from "@/components/sections/Evidence";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/ui/PageHero";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const PILLAR_INDEX = ["I", "II", "III"] as const;

export function SciencePageContent() {
  const { t } = useLanguage();

  return (
    <>
      <PageHero eyebrow={t.science.eyebrow} title={t.science.title} subtitle={t.science.subtitle} maxWidth="4xl" />

      <section className="bg-background py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <ol className="grid border-y border-border md:grid-cols-3 md:divide-x md:divide-border">
            {t.science.pillars.map(({ title, desc }, i) => (
              <li key={title} className="border-b border-border py-7 last:border-b-0 md:border-b-0 md:px-7 md:first:pl-0">
                <span className="font-mono text-sm text-secondary">{PILLAR_INDEX[i]}</span>
                <h2 className="mt-2 text-2xl font-bold text-foreground">{title}</h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">{desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Same figures, methods and caveats as the Home — one source. */}
      <Evidence headingOverride={t.science.statsHeading} numbered={false} />

      <section className="border-t border-border bg-background py-16 md:py-20">
        <div className="container mx-auto flex flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between md:px-6">
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">{t.science.sportCtaText}</p>
          <Button asChild size="lg" variant="outline">
            <Link href="/sport/science">{t.science.sportCtaButton}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
