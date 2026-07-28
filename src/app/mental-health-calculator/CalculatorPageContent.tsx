"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/home/Reveal";
import { MentalHealthCalculator } from "@/components/sections/MentalHealthCalculator";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/ui/PageHero";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { EXTERNAL_REPORTS } from "@/lib/constants";
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
              <blockquote className="relative h-full overflow-hidden rounded-2xl border-l-[6px] border-brand-blue bg-gradient-to-br from-brand-blue/[0.06] to-card p-10 shadow-sm">
                <span aria-hidden="true" className="font-exo text-7xl font-bold leading-none text-brand-blue/15">
                  &ldquo;
                </span>
                <p className="-mt-8 font-exo text-2xl font-semibold leading-snug text-foreground md:text-[1.65rem]">
                  {t.calculator.bottomQuote1}
                </p>
                <footer className="mt-6 border-t border-border pt-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  <a
                    href={EXTERNAL_REPORTS.deloitte}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-brand-blue hover:underline"
                  >
                    {t.calculator.bottomQuote1Author}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </footer>
              </blockquote>
            </Reveal>
            <Reveal delay={0.08} className="h-full">
              <blockquote className="relative h-full overflow-hidden rounded-2xl border-l-[6px] border-brand-teal bg-gradient-to-br from-brand-teal/[0.06] to-card p-10 shadow-sm">
                <span aria-hidden="true" className="font-exo text-7xl font-bold leading-none text-brand-teal/15">
                  &ldquo;
                </span>
                <p className="-mt-8 font-exo text-2xl font-semibold leading-snug text-foreground md:text-[1.65rem]">
                  {t.calculator.bottomQuote2}
                </p>
                <footer className="mt-6 border-t border-border pt-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  <a
                    href={EXTERNAL_REPORTS.who}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-brand-teal hover:underline"
                  >
                    {t.calculator.bottomQuote2Author}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
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
