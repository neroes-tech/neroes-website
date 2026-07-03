import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PARTNERS, TEAM_MEMBERS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sport — About Us",
  description:
    "Neroes started as an idea developed by Pedro Pestana and Hugo Ferreira at the Faculty of Sciences of the University of Lisbon.",
};

export default function SportAboutPage() {
  return (
    <>
      <section className="bg-background py-24">
        <div className="container mx-auto max-w-4xl px-4 text-center md:px-6">
          <h1 className="mb-6 font-exo text-4xl font-bold text-primary md:text-5xl">
            We want to take sports performance and well-being to the cutting edge
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            We are driven to explore mental potential into the edge of sports performance in perfect
            harmony between passion and science.
          </p>
        </div>
      </section>

      <section className="bg-muted py-20">
        <div className="container mx-auto max-w-4xl space-y-6 px-4 text-center md:px-6">
          <h2 className="font-exo text-3xl font-bold text-primary">Our mission: human empowerment</h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Neroes started as an idea developed by Pedro Pestana and Hugo Ferreira while working at the
            Faculty of Sciences of the University of Lisbon. They both bring a passion for human performance
            and the desire to use scientific and technological knowledge in service of human empowerment.
          </p>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="mb-12 text-center font-exo text-3xl font-bold text-primary">Our Team</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM_MEMBERS.map((member) => (
              <div key={member.name} className="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
                <div
                  aria-hidden="true"
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 font-exo text-xl font-bold text-primary"
                >
                  {member.name.charAt(0)}
                </div>
                <p className="font-bold text-foreground">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted py-20">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <h2 className="mb-10 text-center font-exo text-3xl font-bold text-primary">Partnerships</h2>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {PARTNERS.map((partner) => (
              <a
                key={partner.name}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-muted-foreground transition-colors hover:text-primary"
              >
                {partner.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-20 text-center">
        <div className="container mx-auto px-4 md:px-6">
          <Button asChild size="lg" className="bg-secondary font-semibold text-white hover:bg-secondary/90">
            <Link href="/contact">Talk to us!</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
