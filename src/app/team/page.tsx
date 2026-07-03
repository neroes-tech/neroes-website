import type { Metadata } from "next";

import { TEAM_BIOS, TEAM_MEMBERS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Team",
  description:
    "We are driven to explore human potential, in a perfect harmony between emotion and logic.",
};

export default function TeamPage() {
  return (
    <>
      <section className="bg-background py-24">
        <div className="container mx-auto max-w-3xl px-4 text-center md:px-6">
          <h1 className="mb-6 font-exo text-4xl font-bold text-primary md:text-5xl">Team</h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            We are driven to explore human potential, in a perfect harmony between emotion and logic since
            our team skills match perfectly the needs of the project: neuroscience, psychology, videogame
            and software development, data analytics, and translation of academic knowledge into business.
          </p>
        </div>
      </section>

      <section className="bg-muted py-20">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM_MEMBERS.map((member) => {
              const bios = TEAM_BIOS[member.name];
              return (
                <div key={member.name} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <div
                    aria-hidden="true"
                    className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10 font-exo text-lg font-bold text-secondary"
                  >
                    {member.name.charAt(0)}
                  </div>
                  <p className="font-exo font-bold uppercase tracking-wide text-foreground">{member.name}</p>
                  <p className="mb-3 text-sm text-secondary">{member.role}</p>
                  {bios && (
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {bios.map((line) => (
                        <li key={line}>&bull; {line}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="container mx-auto max-w-3xl px-4 text-center md:px-6">
          <h2 className="mb-8 font-exo text-3xl font-bold text-primary">What people say about us</h2>
          <blockquote className="space-y-4">
            <p className="text-xl italic leading-relaxed text-foreground">
              &ldquo;The goal of the game is simple and clear: focus and focus better, eliminating anxiety.
              And the game hits that goal.&rdquo;
            </p>
            <footer className="font-medium text-muted-foreground">&mdash; In&ecirc;s, 21 years old</footer>
          </blockquote>
        </div>
      </section>
    </>
  );
}
