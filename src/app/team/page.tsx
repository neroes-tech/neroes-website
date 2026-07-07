import type { Metadata } from "next";

import { Reveal } from "@/components/home/Reveal";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TEAM_BIOS, TEAM_MEMBERS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Team",
  description:
    "We are driven to explore human potential, in a perfect harmony between emotion and logic.",
};

export default function TeamPage() {
  return (
    <>
      <PageHero
        title="Team"
        maxWidth="3xl"
        subtitle="We are driven to explore human potential, in a perfect harmony between emotion and logic since our team skills match perfectly the needs of the project: neuroscience, psychology, videogame and software development, data analytics, and translation of academic knowledge into business."
      />

      <section className="border-y border-border bg-muted py-24">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM_MEMBERS.map((member, i) => {
              const bios = TEAM_BIOS[member.name];
              return (
                <Reveal key={member.name} delay={i * 0.08} className="h-full">
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

      <section className="bg-background py-24 md:py-32">
        <div className="container mx-auto max-w-3xl px-4 md:px-6">
          <SectionHeading title="What people say about us" />
          <Reveal>
            <blockquote className="space-y-6 text-center">
              <p className="font-exo text-2xl font-medium italic leading-relaxed text-foreground md:text-3xl">
                &ldquo;The goal of the game is simple and clear: focus and focus better, eliminating
                anxiety. And the game hits that goal.&rdquo;
              </p>
              <footer className="font-medium text-muted-foreground">
                &mdash; In&ecirc;s, 21 years old
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </section>
    </>
  );
}
