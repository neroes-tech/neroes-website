"use client";

import Link from "next/link";
import { Activity, Brain, LineChart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

const PILLAR_ICONS = [Brain, Activity, LineChart] as const;

/**
 * Science page in its version 2 layout — three pillar cards, the headline
 * results in one centred row, the sport case study — with the current
 * figures (the −41% always with its source).
 */
export function SciencePageContent() {
  const { t } = useLanguage();

  return (
    <>
      <PageHero eyebrow={t.science.eyebrow} title={t.science.title} subtitle={t.science.subtitle} maxWidth="4xl" />

      {/* The three pillars */}
      <section className="bg-muted py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {t.science.pillars.map(({ title, desc }, i) => {
              const Icon = PILLAR_ICONS[i]!;
              return (
                <Card key={title} className="h-full text-center">
                  <CardContent className="space-y-4 p-8">
                    <div className="mx-auto inline-flex rounded-md bg-secondary/10 p-3">
                      <Icon className="h-7 w-7 text-secondary" aria-hidden="true" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">{title}</h2>
                    <p className="leading-relaxed text-muted-foreground">{desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Headline results, each with where it comes from */}
      <section className="bg-background py-20 md:py-24" aria-labelledby="science-stats-heading">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading id="science-stats-heading" title={t.science.statsHeading} align="center" />
          <dl className="mx-auto grid max-w-5xl grid-cols-2 gap-x-8 gap-y-10 text-center md:grid-cols-4">
            {t.science.stats.map((stat, i) => (
              <div key={stat.label} className="flex flex-col-reverse gap-2">
                <dt>
                  <span className="block font-medium text-foreground">{stat.label}</span>
                  {/* One line per part ("3 clientes" / "8+ sessões") instead of a
                      "·" stranded at the start of a wrapped line. */}
                  <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                    {stat.source.split(" · ").map((part) => (
                      <span key={part} className="block">
                        {part}
                      </span>
                    ))}
                  </span>
                </dt>
                <dd
                  className={cn(
                    "font-exo text-4xl font-bold tabular-nums md:text-5xl",
                    i === 0 ? "text-secondary" : "text-foreground",
                  )}
                >
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Sport case study */}
      <section className="border-t border-border bg-card py-20 md:py-24">
        <div className="container mx-auto max-w-2xl px-4 text-center md:px-6">
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">{t.science.sportCtaText}</p>
          <Button asChild size="lg" variant="outline">
            <Link href="/sport/science">{t.science.sportCtaButton}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
