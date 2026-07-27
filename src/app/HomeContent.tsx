"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Brain,
  Heart,
  Moon,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
  Users,
} from "lucide-react";

import { Hero } from "@/components/home/Hero";
import { Reveal } from "@/components/home/Reveal";
import { ClientTestimonials } from "@/components/sections/ClientTestimonials";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ProductShowcase } from "@/components/sections/ProductShowcase";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { TEAM_BIOS, TEAM_MEMBERS } from "@/lib/constants";

const PLATFORM_ICONS = [Brain, Activity, BarChart3, SlidersHorizontal, Users, ShieldCheck] as const;
const BENEFITS_ICONS = [Users, TrendingUp, Heart] as const;
const FEATURES_ICONS = [Shield, Activity, Moon] as const;
const STATS_META = [
  { prefix: "+", end: 111, suffix: "%", color: "text-primary" },
  { prefix: "+", end: 21, suffix: ".7%", color: "text-primary" },
  { prefix: "+", end: 9, suffix: ".4%", color: "text-primary" },
  { prefix: "-", end: 14, suffix: ".2%", color: "text-secondary" },
] as const;

// Only the two co-founders (per docs/content-inventory.md and the Sport
// About page: "Neroes started as an idea developed by Pedro Pestana and
// Hugo Ferreira") — real bios from TEAM_BIOS, not fabricated.
const FOUNDERS = TEAM_MEMBERS.filter((m) => m.role.includes("Co-Founder"));

function SectionEyebrow({ children }: { children: string }) {
  return (
    <p className="text-center font-mono text-sm font-medium uppercase tracking-widest text-secondary">
      {children}
    </p>
  );
}

export function HomeContent() {
  const { t, locale } = useLanguage();

  return (
    <div lang={locale === "pt" ? "pt-PT" : "en"}>
      <Hero />

      {/* 01 — THE PROBLEM: real workplace mental-health cost data */}
      <section className="border-b border-border bg-muted py-24 md:py-32" aria-labelledby="problem-heading">
        <div className="container mx-auto px-4 md:px-6">
          <Reveal className="mb-16 text-center">
            <SectionEyebrow>{t.home.problemEyebrow}</SectionEyebrow>
            <h2 id="problem-heading" className="mt-3 font-exo text-3xl font-bold text-primary md:text-5xl">
              {t.home.problemTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">{t.home.problemSubtitle}</p>
          </Reveal>
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
            {t.shared.problemFacts.map(({ title, stat, detail }, i) => (
              <Reveal key={title} delay={i * 0.08} className="h-full">
                <Card className="h-full border-border bg-card">
                  <CardContent className="space-y-3 pt-8 text-center">
                    <p className="font-exo text-lg font-bold text-foreground">{title}</p>
                    <p className="leading-relaxed text-muted-foreground">
                      <strong>{stat}</strong>
                      <br />
                      {detail}
                    </p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 02 — THE PLATFORM: how it works + feature set + benefits */}
      <div className="pt-24 md:pt-32">
        <Reveal>
          <SectionEyebrow>{t.home.platformEyebrow}</SectionEyebrow>
        </Reveal>
      </div>
      <HowItWorks />

      <section className="relative overflow-hidden bg-muted py-24 md:py-32">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-0 top-20 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-decorative-violet-soft blur-3xl" />
          <div className="bg-neural-grid absolute inset-0 text-primary/[0.05]" />
        </div>
        <div className="container relative mx-auto px-4 md:px-6">
          <Reveal className="mb-16 text-center">
            <h2 className="mb-4 font-exo text-3xl font-bold text-primary md:text-5xl">
              {t.home.platformHeading}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{t.home.platformSubtitle}</p>
          </Reveal>
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PLATFORM_ICONS.map((Icon, i) => (
              <Reveal key={t.home.platformFeatures[i]!.title} delay={i * 0.08} className="h-full">
                <Card className="h-full border-border bg-card transition-all hover:-translate-y-1 hover:shadow-glow-primary">
                  <CardContent className="space-y-4 pt-8">
                    <div className="inline-flex rounded-xl bg-secondary/10 p-3">
                      <Icon className="h-7 w-7 text-secondary" aria-hidden="true" />
                    </div>
                    <h3 className="font-exo text-xl font-bold text-foreground">
                      {t.home.platformFeatures[i]!.title}
                    </h3>
                    <p className="leading-relaxed text-muted-foreground">{t.home.platformFeatures[i]!.desc}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2">
            <Reveal className="space-y-8">
              <h2 className="font-exo text-4xl font-bold text-primary">{t.home.benefitsHeading}</h2>
              <div className="space-y-6">
                {BENEFITS_ICONS.map((Icon, i) => (
                  <div key={t.home.benefits[i]!.title} className="flex items-start gap-4">
                    <div className="rounded-xl bg-secondary/10 p-3">
                      <Icon className="h-6 w-6 text-secondary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{t.home.benefits[i]!.title}</h3>
                      <p className="mt-1 text-muted-foreground">{t.home.benefits[i]!.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal className="space-y-8" delay={0.1}>
              <h2 className="font-exo text-4xl font-bold text-primary">{t.home.featuresHeading}</h2>
              <div className="space-y-6">
                {FEATURES_ICONS.map((Icon, i) => (
                  <div key={t.home.features[i]!.title} className="flex items-start gap-4">
                    <div className="rounded-xl bg-accent/10 p-3">
                      <Icon className="h-6 w-6 text-accent" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{t.home.features[i]!.title}</h3>
                      <p className="mt-1 text-muted-foreground">{t.home.features[i]!.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Equipment / headset demo video */}
      <ProductShowcase />

      {/* 03 — THE EVIDENCE & TESTIMONIALS: verified outcome stats + real client quotes */}
      <div className="border-t border-border pt-24 md:pt-32">
        <Reveal>
          <SectionEyebrow>{t.home.evidenceEyebrow}</SectionEyebrow>
        </Reveal>
      </div>
      <section className="bg-muted pb-24 pt-8 md:pb-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 text-center md:grid-cols-4">
            {STATS_META.map(({ prefix, end, suffix, color }, i) => (
              <Reveal key={t.home.statsLabels[i]} delay={i * 0.08} className="space-y-2">
                <div className={`font-exo text-5xl font-bold md:text-6xl ${color}`}>
                  <AnimatedCounter prefix={prefix} end={end} suffix={suffix} />
                </div>
                <p className="text-lg font-medium text-muted-foreground">{t.home.statsLabels[i]}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ClientTestimonials />

      {/* Final CTA */}
      <section className="relative overflow-hidden border-t border-border bg-card py-24 md:py-32">
        <div
          aria-hidden="true"
          className="bg-neural-grid pointer-events-none absolute inset-0 text-primary/10"
        />
        <div className="container relative mx-auto px-4 md:px-6">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="font-exo text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              {t.home.finalCtaHeading}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {t.home.finalCtaBody}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group h-14 rounded-full bg-secondary px-8 text-lg font-semibold text-secondary-foreground transition-shadow hover:bg-secondary/90 hover:shadow-glow-secondary"
              >
                <Link href="/contact">
                  {t.home.finalCtaPrimary}
                  <ArrowRight
                    className="h-5 w-5 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 rounded-full border-primary px-8 text-lg text-primary hover:bg-primary/5"
              >
                <Link href="/science">{t.home.finalCtaSecondary}</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Founder spotlight — real bios from TEAM_BIOS, closing section before the
          global partners bar (rendered in layout.tsx, after every page). */}
      <section className="border-t border-border bg-background py-24 md:py-32" aria-labelledby="founders-heading">
        <div className="container mx-auto px-4 md:px-6">
          <Reveal className="mb-14 text-center">
            <h2 id="founders-heading" className="font-exo text-3xl font-bold text-primary md:text-4xl">
              {t.home.foundersHeading}
            </h2>
          </Reveal>
          <div className="mx-auto grid max-w-3xl gap-8 sm:grid-cols-2">
            {FOUNDERS.map(({ name, role }, i) => (
              <Reveal key={name} delay={i * 0.08}>
                <Card className="h-full border-border bg-card">
                  <CardContent className="space-y-3 pt-8">
                    <p className="font-exo text-xl font-bold text-foreground">{name}</p>
                    <p className="text-sm font-medium text-secondary">{role}</p>
                    <ul className="space-y-1 pt-2 text-sm text-muted-foreground">
                      {(TEAM_BIOS[name] ?? []).map((line) => (
                        <li key={line} lang="en">
                          {line}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
          <p className="mt-10 text-center">
            <Link href="/about" className="font-medium text-secondary hover:underline">
              {t.home.viewTeamLink}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
