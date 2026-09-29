"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { PARTNERS, TEAM_MEMBERS, teamBios } from "@/lib/constants";

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
            className="mb-0"
          />
        </div>
      </section>

      {/* Team — a directory, not a grid of avatar cards */}
      <section className="border-t border-border bg-muted py-20 md:py-28" aria-labelledby="team-heading">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading id="team-heading" eyebrow={t.about.teamEyebrow} title={t.about.teamTitle} intro={t.about.teamIntro} />
          <ul className="border-b border-border">
            {TEAM_MEMBERS.map((member) => (
              <li key={member.name} className="grid gap-2 border-t border-border py-5 md:grid-cols-12 md:gap-8">
                <h3 className="text-xl font-bold text-foreground md:col-span-4">{member.name}</h3>
                <p className="font-mono text-xs uppercase leading-relaxed tracking-[0.12em] text-secondary md:col-span-3 md:pt-1.5">
                  {member.role}
                </p>
                {bios[member.name] && (
                  <p className="leading-relaxed text-muted-foreground md:col-span-5">
                    {bios[member.name]!.join(" · ")}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Partnerships */}
      <section className="border-t border-border bg-background py-20 md:py-24" aria-labelledby="partnerships-heading">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading id="partnerships-heading" eyebrow={t.about.partnershipsEyebrow} title={t.about.partnershipsTitle} />
          <ul className="flex flex-wrap gap-x-10 gap-y-3">
            {PARTNERS.map((partner) => (
              <li key={partner.name}>
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-1 text-xl font-semibold text-muted-foreground transition-colors hover:text-foreground"
                >
                  {partner.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Testimonial */}
      <section className="border-t border-border bg-muted py-20 md:py-24" aria-labelledby="about-testimonial-heading">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading id="about-testimonial-heading" title={t.about.testimonialsTitle} />
          <figure className="max-w-3xl border-l-2 border-secondary pl-6">
            <blockquote className="text-2xl font-medium leading-relaxed text-foreground md:text-3xl">
              “{t.about.testimonialQuote}”
            </blockquote>
            <figcaption className="mt-4 text-muted-foreground">{t.about.testimonialAuthor}</figcaption>
          </figure>
        </div>
      </section>

      <section className="border-t border-border bg-background py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <Button asChild size="lg">
            <Link href="/contact">{t.about.ctaButton}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
