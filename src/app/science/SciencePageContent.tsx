"use client";

import Link from "next/link";
import { Activity, Brain, LineChart } from "lucide-react";

import { Reveal } from "@/components/home/Reveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const PILLAR_ICONS = [Brain, Activity, LineChart] as const;

const STATS_META = [
  { prefix: "+", end: 111, suffix: "%", color: "text-primary" },
  { prefix: "+", end: 21, suffix: ".7%", color: "text-primary" },
  { prefix: "+", end: 9, suffix: ".4%", color: "text-primary" },
  { prefix: "-", end: 14, suffix: ".2%", color: "text-secondary" },
] as const;

export function SciencePageContent() {
  const { t } = useLanguage();

  return (
    <>
      <PageHero eyebrow={t.science.eyebrow} title={t.science.title} subtitle={t.science.subtitle} maxWidth="4xl" />

      <section className="bg-muted py-24">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {t.science.pillars.map(({ title, desc }, i) => {
              const Icon = PILLAR_ICONS[i]!;
              return (
                <Reveal key={title} delay={i * 0.08} className="h-full">
                  <Card className="h-full border-border bg-card text-center shadow-sm transition-shadow duration-300 hover:shadow-glow-primary">
                    <CardContent className="space-y-4 pt-8">
                      <div className="mx-auto inline-flex rounded-xl bg-secondary/10 p-3">
                        <Icon className="h-7 w-7 text-secondary" aria-hidden="true" />
                      </div>
                      <h2 className="font-exo text-xl font-bold text-foreground">{title}</h2>
                      <p className="leading-relaxed text-muted-foreground">{desc}</p>
                    </CardContent>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <Reveal>
            <SectionHeading title={t.science.statsHeading} />
          </Reveal>
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 text-center md:grid-cols-4">
            {STATS_META.map(({ prefix, end, suffix, color }, i) => (
              <Reveal key={t.science.statsLabels[i]} delay={i * 0.08} className="space-y-2">
                <div className={`font-exo text-4xl font-bold md:text-5xl ${color}`}>
                  <AnimatedCounter prefix={prefix} end={end} suffix={suffix} />
                </div>
                <p className="text-sm font-medium text-muted-foreground">{t.science.statsLabels[i]}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-border bg-card py-24">
        <div
          aria-hidden="true"
          className="bg-neural-grid pointer-events-none absolute inset-0 text-primary/10"
        />
        <div className="container relative mx-auto max-w-2xl px-4 text-center md:px-6">
          <Reveal>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">{t.science.sportCtaText}</p>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 rounded-full border-primary px-8 text-lg text-primary hover:bg-primary/5"
            >
              <Link href="/sport/science">{t.science.sportCtaButton}</Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
