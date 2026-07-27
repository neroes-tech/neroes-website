"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/home/Reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StarRating } from "@/components/ui/StarRating";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { PARTNERS, TEAM_BIOS, TEAM_MEMBERS } from "@/lib/constants";

export function AboutPageContent() {
  const { t } = useLanguage();

  return (
    <>
      <PageHero eyebrow={t.about.eyebrow} title={t.about.title} maxWidth="3xl" />

      {/* Vision */}
      <section className="bg-background py-24 md:py-32">
        <div className="container mx-auto max-w-4xl px-4 md:px-6">
          <Reveal>
            <SectionHeading
              eyebrow={t.about.visionEyebrow}
              title={t.about.visionTitle}
              intro={t.about.visionIntro}
              className="mb-0"
            />
          </Reveal>
        </div>
      </section>

      {/* Team */}
      <section className="border-y border-border bg-muted py-24 md:py-32">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <Reveal>
            <SectionHeading eyebrow={t.about.teamEyebrow} title={t.about.teamTitle} intro={t.about.teamIntro} />
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM_MEMBERS.map((member, i) => {
              const bios = TEAM_BIOS[member.name];
              return (
                <Reveal key={member.name} delay={i * 0.06} className="h-full">
                  <Card className="h-full shadow-sm transition-shadow duration-300 hover:shadow-glow-primary">
                    <CardContent className="p-8">
                      <div
                        aria-hidden="true"
                        className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10 font-exo text-lg font-bold text-secondary"
                      >
                        {member.name.charAt(0)}
                      </div>
                      <p className="font-exo text-lg font-bold tracking-tight text-foreground">
                        {member.name}
                      </p>
                      <p className="text-sm font-medium text-secondary">{member.role}</p>
                      {bios && (
                        <ul className="mt-4 space-y-2 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
                          {bios.map((line) => (
                            <li key={line} className="flex items-start gap-2.5">
                              <span
                                aria-hidden="true"
                                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary/60"
                              />
                              {line}
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partnerships */}
      <section className="bg-background py-24 md:py-32">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <Reveal>
            <SectionHeading eyebrow={t.about.partnershipsEyebrow} title={t.about.partnershipsTitle} />
            <ul className="flex list-none flex-wrap items-center justify-center gap-x-12 gap-y-5">
              {PARTNERS.map((partner) => (
                <li key={partner.name}>
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block py-1 font-exo text-xl font-semibold tracking-wide text-muted-foreground transition-colors hover:text-primary"
                  >
                    {partner.name}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Testimonial */}
      <section className="border-t border-border bg-muted py-24 md:py-32">
        <div className="container mx-auto max-w-3xl px-4 md:px-6">
          <SectionHeading title={t.about.testimonialsTitle} />
          <Reveal>
            <blockquote className="space-y-6 text-center">
              <StarRating className="justify-center" />
              <p className="font-exo text-2xl font-medium italic leading-relaxed text-foreground md:text-3xl">
                &ldquo;{t.about.testimonialQuote}&rdquo;
              </p>
              <footer className="font-medium text-muted-foreground">{t.about.testimonialAuthor}</footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden border-t border-border bg-card py-24 md:py-32">
        <div
          aria-hidden="true"
          className="bg-neural-grid pointer-events-none absolute inset-0 text-primary/10"
        />
        <div className="container relative mx-auto px-4 md:px-6">
          <Reveal className="text-center">
            <Button
              asChild
              size="lg"
              className="group h-14 rounded-full bg-secondary px-8 text-lg font-semibold text-secondary-foreground transition-shadow hover:bg-secondary/90 hover:shadow-glow-secondary"
            >
              <Link href="/contact">
                {t.about.ctaButton}
                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
