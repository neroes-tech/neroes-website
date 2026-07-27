"use client";

import Link from "next/link";

import { Reveal } from "@/components/home/Reveal";
import { MentalHealthCalculator } from "@/components/sections/MentalHealthCalculator";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/ui/PageHero";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { CalculatorForm } from "./CalculatorForm";

export function CalculatorPageContent() {
  const { t } = useLanguage();

  return (
    <>
      <PageHero
        eyebrow={t.calculator.eyebrow}
        title={t.calculator.title}
        subtitle={t.calculator.subtitle}
        maxWidth="6xl"
        size="compact"
      />

      <section className="bg-background pb-24">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <CalculatorForm />
        </div>
      </section>

      <MentalHealthCalculator />

      <section className="border-t border-border bg-muted py-24">
        <div className="container mx-auto max-w-6xl space-y-16 px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            <Reveal className="h-full">
              <blockquote className="h-full rounded-2xl border-l-4 border-secondary bg-card p-8 shadow-sm">
                <p className="mb-4 text-xl font-medium italic leading-relaxed text-foreground">
                  &ldquo;{t.calculator.bottomQuote1}&rdquo;
                </p>
                <footer className="text-sm font-bold text-muted-foreground">
                  {t.calculator.bottomQuote1Author}
                </footer>
              </blockquote>
            </Reveal>
            <Reveal delay={0.08} className="h-full">
              <blockquote className="h-full rounded-2xl border-l-4 border-primary bg-card p-8 shadow-sm">
                <p className="mb-4 text-xl font-medium italic leading-relaxed text-foreground">
                  &ldquo;{t.calculator.bottomQuote2}&rdquo;
                </p>
                <footer className="text-sm font-bold text-muted-foreground">
                  {t.calculator.bottomQuote2Author}
                </footer>
              </blockquote>
            </Reveal>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {t.shared.problemFacts.map(({ title, stat, detail }, i) => (
              <Reveal key={title} delay={i * 0.08} className="h-full">
                <div className="h-full rounded-2xl border border-border bg-card p-8 shadow-sm transition-shadow duration-300 hover:shadow-glow-primary">
                  <h2 className="font-exo text-2xl font-bold text-primary">{title}</h2>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    <strong>{stat}</strong>
                    <br />
                    {detail}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Button asChild size="lg" className="h-14 rounded-full px-8 text-lg">
              <Link href="/brain-experience">{t.calculator.ctaButton1}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 rounded-full border-primary px-8 text-lg text-primary hover:bg-primary/5"
            >
              <Link href="/brain-experience">{t.calculator.ctaButton2}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
