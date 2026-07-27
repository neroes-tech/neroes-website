"use client";

import { Reveal } from "@/components/home/Reveal";
import { ClientTestimonials } from "@/components/sections/ClientTestimonials";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { CALENDLY_URL } from "@/lib/constants";
import { BrainExperienceVideo } from "./BrainExperienceVideo";

const STATS_META = [
  { end: 1034, suffix: "", color: "text-primary" },
  { end: 96, suffix: "+", color: "text-primary" },
  { end: 92, suffix: "%", color: "text-secondary" },
] as const;

export function BrainExperienceContent() {
  const { t } = useLanguage();

  return (
    <>
      <PageHero
        variant="decorative"
        maxWidth="4xl"
        title={t.brainExperience.title}
        subtitle={
          <>
            <span className="block font-exo text-2xl font-bold text-secondary md:text-4xl">
              {t.brainExperience.subtitleHeading}
            </span>
            <span className="mx-auto mt-6 block max-w-3xl text-xl">{t.brainExperience.description}</span>
          </>
        }
        cta={
          <Button
            asChild
            size="lg"
            className="h-14 rounded-full bg-secondary px-8 text-lg font-semibold text-secondary-foreground transition-shadow hover:bg-secondary/90 hover:shadow-glow-secondary"
          >
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              {t.brainExperience.ctaButton}
            </a>
          </Button>
        }
      />

      <section className="border-b border-border bg-background py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <BrainExperienceVideo />
            </Reveal>

            <Reveal delay={0.1} className="space-y-10">
              <SectionHeading title={t.brainExperience.videoHeading} className="mb-0" />
              <div className="grid grid-cols-3 gap-6 text-center">
                {STATS_META.map(({ end, suffix, color }, i) => (
                  <Reveal key={t.brainExperience.statsLabels[i]} delay={0.1 + i * 0.08} className="space-y-2">
                    <div className={`font-exo text-3xl font-bold md:text-4xl ${color}`}>
                      <AnimatedCounter end={end} suffix={suffix} />
                    </div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground md:text-sm">
                      {t.brainExperience.statsLabels[i]}
                    </p>
                  </Reveal>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <ClientTestimonials />
    </>
  );
}
