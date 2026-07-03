import type { Metadata } from "next";
import Link from "next/link";

import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sport — Science",
  description:
    "The Estoril Team case study: after 4 months of training with the Neroes Mental Training Platform, results were already visible.",
};

export default function SportSciencePage() {
  return (
    <>
      <section className="bg-background py-24">
        <div className="container mx-auto max-w-4xl px-4 text-center md:px-6">
          <h1 className="mb-6 font-exo text-4xl font-bold text-primary md:text-5xl">
            There&apos;s a whole body of science behind what we do
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Our Mental Training Platform&trade; would be impossible without extensive research and
            validated studies about mental health and its effects on physical and mental performance.
          </p>
        </div>
      </section>

      <section className="bg-muted py-20">
        <div className="container mx-auto max-w-4xl px-4 text-center md:px-6">
          <h2 className="mb-4 font-exo text-3xl font-bold text-primary">Key Aspects for improved Performance</h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            We worked with professional football teams to assess different aspects of mental well-being and
            efficiency, such as Information Processing Speed and Decision-Making.
          </p>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="container mx-auto max-w-4xl px-4 md:px-6">
          <h2 className="mb-6 text-center font-exo text-3xl font-bold text-primary">
            The Estoril Team case study
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>
              We trained the Estoril A and Estoril sub-23 teams for four months, comparing a control group
              using the Neroes MTP&trade; and a group using a standard intervention.
            </p>
            <p>
              After 4 months, results were already visible: the emotional control biomarker increased more
              than 300%, and processing speed (the &ldquo;thinking speed&rdquo;) increased by more than 20%
              in comparison with the control group.
            </p>
            <p>
              Overall, there was an increase of 9.4% in self-confidence compared to the players who
              didn&apos;t use our solution.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <h2 className="mb-10 text-center font-exo text-3xl font-bold">The results are visible</h2>
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-8 text-center md:grid-cols-4">
            {[
              { end: 300, suffix: "%+", label: "Emotional control biomarker" },
              { end: 20, suffix: "%+", label: "Processing speed" },
              { end: 9, suffix: ".4%", label: "Self-confidence" },
              { end: 4, suffix: "%", label: "More correct actions per season" },
            ].map(({ end, suffix, label }) => (
              <div key={label} className="space-y-2">
                <div className="font-exo text-4xl font-bold text-secondary md:text-5xl">
                  <AnimatedCounter end={end} suffix={suffix} />
                </div>
                <p className="text-sm font-medium text-primary-foreground/80">{label}</p>
              </div>
            ))}
          </div>
          <Card className="mx-auto mt-12 max-w-3xl border-primary-foreground/10 bg-primary-foreground/5 text-primary-foreground">
            <CardContent className="pt-6">
              <p className="text-center text-primary-foreground/90">
                After just three months of intervention, a Neroes training group showed a 4% higher number
                of &ldquo;correct&rdquo; actions &mdash; dribbles, passes and shots &mdash; corresponding to
                over 1,000 better executions by a full roster during a season, which could critically
                determine the season outcome.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-background py-20 text-center">
        <div className="container mx-auto max-w-2xl px-4 md:px-6">
          <h2 className="mb-2 font-exo text-3xl font-bold text-primary">
            Take a winner&apos;s shot for your next championship
          </h2>
          <p className="mb-8 text-muted-foreground">Don&apos;t waste time, start now.</p>
          <Button asChild size="lg" className="bg-secondary font-semibold text-white hover:bg-secondary/90">
            <Link href="/contact">Talk to us!</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
