import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/home/Reveal";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TEAM_MEMBERS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sport — About Us",
  description:
    "Neroes started as an idea developed by Pedro Pestana and Hugo Ferreira at the Faculty of Sciences of the University of Lisbon.",
};

export default function SportAboutPage() {
  return (
    // This page exists in English only, inside the Portuguese site chrome.
    <div lang="en">
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
                <div className="h-full rounded-md border border-border bg-card p-8 text-center">
                  <p className="font-exo text-lg font-bold text-foreground">{member.name}</p>
                  <p className="mt-1 text-sm text-secondary">{member.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-background py-24 md:py-32">
        <div className="container relative mx-auto px-4 text-center md:px-6">
          <Reveal>
            <Button
              asChild
              size="lg"
            >
              <Link href="/contact">
                Talk to us!
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
