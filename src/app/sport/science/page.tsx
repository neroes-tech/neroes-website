import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/home/Reveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Sport — Science",
  description:
    "The Estoril Team case study: after 4 months of training with the Neroes Mental Training Platform, results were already visible.",
};

const RESULTS = [
  { end: 300, suffix: "%+", label: "Emotional control biomarker" },
  { end: 20, suffix: "%+", label: "Processing speed" },
  { end: 9, suffix: ".4%", label: "Self-confidence" },
  { end: 4, suffix: "%", label: "More correct actions per season" },
] as const;

export default function SportSciencePage() {
  return (
    <>
      <PageHero
        eyebrow="Sport science"
        title="There's a whole body of science behind what we do"
        subtitle={
          <>
            Our Mental Training Platform&trade; would be impossible without extensive research and
            validated studies about mental health and its effects on physical and mental performance.
          </>
        }
      />

      <section className="bg-muted py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <Reveal>
            <SectionHeading
              title="Key Aspects for improved Performance"
              intro="We worked with professional football teams to assess different aspects of mental well-being and efficiency, such as Information Processing Speed and Decision-Making."
              className="mb-0"
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-background py-24 md:py-32">
        <div className="container mx-auto max-w-4xl px-4 md:px-6">
          <Reveal>
            <SectionHeading eyebrow="Case study" title="The Estoril Team case study" />
          </Reveal>
          <Reveal delay={0.08}>
            <div className="mx-auto max-w-2xl space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>
                We trained the Estoril A and Estoril sub-23 teams for four months, comparing a control
                group using the Neroes MTP&trade; and a group using a standard intervention.
              </p>
              <p>
                After 4 months, results were already visible: the emotional control biomarker increased
                more than 300%, and processing speed (the &ldquo;thinking speed&rdquo;) increased by more
                than 20% in comparison with the control group.
              </p>
              <p>
                Overall, there was an increase of 9.4% in self-confidence compared to the players who
                didn&apos;t use our solution.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-muted py-24 md:py-32">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-56 w-56 rounded-full bg-decorative-violet-soft blur-3xl" />
          <div className="bg-neural-grid absolute inset-0 text-primary/[0.05]" />
        </div>
        <div className="container relative mx-auto max-w-5xl px-4 md:px-6">
          <Reveal>
            <SectionHeading title="The results are visible" />
          </Reveal>
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-8 text-center md:grid-cols-4">
            {RESULTS.map(({ end, suffix, label }, i) => (
              <Reveal key={label} delay={i * 0.08} className="space-y-2">
                <div className="font-exo text-4xl font-bold text-secondary md:text-5xl">
                  <AnimatedCounter end={end} suffix={suffix} />
                </div>
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.16} className="mx-auto mt-14 max-w-3xl">
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <p className="text-center leading-relaxed text-foreground/90">
                  After just three months of intervention, a Neroes training group showed a 4% higher
                  number of &ldquo;correct&rdquo; actions &mdash; dribbles, passes and shots &mdash;
                  corresponding to over 1,000 better executions by a full roster during a season, which
                  could critically determine the season outcome.
                </p>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </section>

      <section className="bg-background py-24 md:py-32">
        <div className="container mx-auto max-w-2xl px-4 text-center md:px-6">
          <Reveal>
            <h2 className="font-exo text-3xl font-bold tracking-tight text-primary md:text-4xl">
              Take a winner&apos;s shot for your next championship
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">Don&apos;t waste time, start now.</p>
            <div className="mt-10">
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
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
