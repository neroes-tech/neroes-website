import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/home/Reveal";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PARTNERS, TEAM_MEMBERS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sport — About Us",
  description:
    "Neroes started as an idea developed by Pedro Pestana and Hugo Ferreira at the Faculty of Sciences of the University of Lisbon.",
};

export default function SportAboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Neroes Sport"
        title="We want to take sports performance and well-being to the cutting edge"
        subtitle="We are driven to explore mental potential into the edge of sports performance in perfect harmony between passion and science."
        maxWidth="4xl"
      />

      {/* Mission */}
      <section className="bg-muted py-24">
        <div className="container mx-auto max-w-4xl px-4 md:px-6">
          <Reveal>
            <SectionHeading
              title="Our mission: human empowerment"
              intro="Neroes started as an idea developed by Pedro Pestana and Hugo Ferreira while working at the Faculty of Sciences of the University of Lisbon. They both bring a passion for human performance and the desire to use scientific and technological knowledge in service of human empowerment."
              className="mb-0 max-w-3xl"
            />
          </Reveal>
        </div>
      </section>

      {/* Team */}
      <section className="bg-background py-24 md:py-32">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <Reveal>
            <SectionHeading title="Our Team" />
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM_MEMBERS.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.06} className="h-full">
                <div className="h-full rounded-xl border border-border bg-card p-8 text-center shadow-sm transition-shadow duration-300 hover:shadow-glow-primary">
                  <div
                    aria-hidden="true"
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 font-exo text-xl font-bold text-primary"
                  >
                    {member.name.charAt(0)}
                  </div>
                  <p className="font-exo text-lg font-bold text-foreground">{member.name}</p>
                  <p className="mt-1 text-sm text-secondary">{member.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Partnerships */}
      <section className="border-y border-border bg-card py-24" aria-label="Partnerships">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <Reveal>
            <SectionHeading title="Partnerships" className="mb-10" />
            <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
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

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-background py-24 md:py-32">
        <div
          aria-hidden="true"
          className="bg-neural-grid pointer-events-none absolute inset-0 text-primary/10"
        />
        <div className="container relative mx-auto px-4 text-center md:px-6">
          <Reveal>
            <Button
              asChild
              size="lg"
              className="group h-14 rounded-full bg-secondary px-8 text-lg font-semibold text-secondary-foreground transition-shadow hover:bg-secondary/90 hover:shadow-glow-secondary"
            >
              <Link href="/contact">
                Talk to us!
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
