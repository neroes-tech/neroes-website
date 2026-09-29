"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { PARTNERS, TEAM_MEMBERS, teamBios } from "@/lib/constants";

/**
 * About page in its version 2 layout: centred sections, the team as a grid
 * of cards (bios in the visitor's language), partners, a testimonial and
 * one call to action.
 */
export function AboutPageContent() {
  const { t, locale } = useLanguage();
  const bios = teamBios(locale);

  return (
    <>
      <PageHero eyebrow={t.about.eyebrow} title={t.about.title} maxWidth="3xl" />

      {/* Vision */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            eyebrow={t.about.visionEyebrow}
            title={t.about.visionTitle}
            intro={t.about.visionIntro}
            align="center"
            className="mb-0"
          />
        </div>
      </section>

      {/* Team */}
      <section className="border-y border-border bg-muted py-20 md:py-28" aria-labelledby="team-heading">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            id="team-heading"
            eyebrow={t.about.teamEyebrow}
            title={t.about.teamTitle}
            intro={t.about.teamIntro}
            align="center"
          />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM_MEMBERS.map((member) => {
              const lines = bios[member.name];
              return (
                <li key={member.name}>
                  <Card className="h-full">
                    <CardContent className="p-8">
                      <div
                        aria-hidden="true"
                        className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10 font-exo text-lg font-bold text-secondary"
                      >
                        {member.name.charAt(0)}
                      </div>
                      <h3 className="font-exo text-lg font-bold tracking-tight text-foreground">{member.name}</h3>
                      <p className="text-sm font-medium text-secondary">{member.role}</p>
                      {lines && (
                        <ul className="mt-4 space-y-2 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
                          {lines.map((line) => (
                            <li key={line} className="flex items-start gap-2.5">
                              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary/60" />
                              {line}
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Partnerships */}
      <section className="bg-background py-20 md:py-28" aria-labelledby="partnerships-heading">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            id="partnerships-heading"
            eyebrow={t.about.partnershipsEyebrow}
            title={t.about.partnershipsTitle}
            align="center"
          />
          <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
            {PARTNERS.map((partner) => (
              <li key={partner.name}>
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-1 font-exo text-xl font-semibold tracking-wide text-muted-foreground transition-colors hover:text-foreground"
                >
                  {partner.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Testimonial */}
      <section className="border-t border-border bg-muted py-20 md:py-28" aria-labelledby="about-testimonial-heading">
        <div className="container mx-auto max-w-3xl px-4 md:px-6">
          <SectionHeading id="about-testimonial-heading" title={t.about.testimonialsTitle} align="center" />
          <figure className="text-center">
            <blockquote className="font-exo text-2xl font-medium italic leading-relaxed text-foreground md:text-3xl">
              “{t.about.testimonialQuote}”
            </blockquote>
            <figcaption className="mt-6 font-medium text-muted-foreground">{t.about.testimonialAuthor}</figcaption>
          </figure>
        </div>
      </section>

      {/* Final call to action */}
      <section className="border-t border-border bg-card py-20 md:py-24">
        <div className="container mx-auto px-4 text-center md:px-6">
          <Button asChild size="lg">
            <Link href="/contact">{t.about.ctaButton}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
