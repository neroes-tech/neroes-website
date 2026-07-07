import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/home/Reveal";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/ui/PageHero";
import { CalculatorForm } from "./CalculatorForm";

export const metadata: Metadata = {
  title: "Mental Health Economy Calculator",
  description:
    "Discover the hidden costs of poor mental health in your company. Uncover the annual financial impact of low performance.",
};

const FACTS = [
  {
    title: "Presenteeism",
    body: (
      <>
        <strong>57 work days lost/year</strong>
        <br />
        60% of employees affected.
      </>
    ),
  },
  {
    title: "Absenteeism",
    body: (
      <>
        <strong>17.5% of sick leaves</strong> due to mental health, 43.3 days/year avg.
      </>
    ),
  },
  {
    title: "Turnover",
    body: (
      <>
        Cost up to <strong>2.3x more</strong> than providing support; turnover reduction up to 60%.
      </>
    ),
  },
] as const;

export default function CalculatorPage() {
  return (
    <>
      <PageHero
        eyebrow="Calculator"
        title="Mental Health Economy - Corporate Calculator"
        subtitle="Discover the hidden costs of poor mental health in your company."
        maxWidth="6xl"
        size="compact"
      />

      <section className="bg-background pb-24">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <CalculatorForm />
        </div>
      </section>

      <section className="border-t border-border bg-muted py-24">
        <div className="container mx-auto max-w-6xl space-y-16 px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            <Reveal className="h-full">
              <blockquote className="h-full rounded-2xl border-l-4 border-secondary bg-card p-8 shadow-sm">
                <p className="mb-4 text-xl font-medium italic leading-relaxed text-foreground">
                  &ldquo;For every 1&euro; spent in mental health, corporates have a 5&euro; ROI.&rdquo;
                </p>
                <footer className="text-sm font-bold text-muted-foreground">
                  &mdash; Deloitte, Mental Health &amp; Employees Report 2024
                </footer>
              </blockquote>
            </Reveal>
            <Reveal delay={0.08} className="h-full">
              <blockquote className="h-full rounded-2xl border-l-4 border-primary bg-card p-8 shadow-sm">
                <p className="mb-4 text-xl font-medium italic leading-relaxed text-foreground">
                  &ldquo;Globally, an estimated 12 billion working days are lost every year to depression and
                  anxiety at a cost of US$ 1 trillion per year.&rdquo;
                </p>
                <footer className="text-sm font-bold text-muted-foreground">&mdash; WHO</footer>
              </blockquote>
            </Reveal>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {FACTS.map(({ title, body }, i) => (
              <Reveal key={title} delay={i * 0.08} className="h-full">
                <div className="h-full rounded-2xl border border-border bg-card p-8 shadow-sm transition-shadow duration-300 hover:shadow-glow-primary">
                  <h2 className="font-exo text-2xl font-bold text-primary">{title}</h2>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Button asChild size="lg" className="h-14 rounded-full px-8 text-lg">
              <Link href="/brain-experience">Find out how to solve this problem</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 rounded-full border-primary px-8 text-lg text-primary hover:bg-primary/5"
            >
              <Link href="/brain-experience">Know more about our solution</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
