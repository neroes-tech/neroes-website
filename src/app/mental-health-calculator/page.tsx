import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CalculatorForm } from "./CalculatorForm";

export const metadata: Metadata = {
  title: "Mental Health Economy Calculator",
  description:
    "Discover the hidden costs of poor mental health in your company. Uncover the annual financial impact of low performance.",
};

export default function CalculatorPage() {
  return (
    <>
      <section className="bg-background py-20">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-16 space-y-4 text-center">
            <h1 className="font-exo text-4xl font-bold text-primary md:text-5xl">
              Mental Health Economy - Corporate Calculator
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover the hidden costs of poor mental health in your company.
            </p>
          </div>

          <CalculatorForm />
        </div>
      </section>

      <section className="bg-muted py-24">
        <div className="container mx-auto max-w-6xl space-y-16 px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <blockquote className="rounded-r-2xl border-l-4 border-secondary bg-card p-8 shadow-sm">
              <p className="mb-4 text-xl font-medium italic text-foreground">
                &ldquo;For every 1&euro; spent in mental health, corporates have a 5&euro; ROI.&rdquo;
              </p>
              <footer className="text-sm font-bold text-muted-foreground">
                &mdash; Deloitte, Mental Health &amp; Employees Report 2024
              </footer>
            </blockquote>
            <blockquote className="rounded-r-2xl border-l-4 border-primary bg-card p-8 shadow-sm">
              <p className="mb-4 text-xl font-medium italic text-foreground">
                &ldquo;Globally, an estimated 12 billion working days are lost every year to depression and
                anxiety at a cost of US$ 1 trillion per year.&rdquo;
              </p>
              <footer className="text-sm font-bold text-muted-foreground">&mdash; WHO</footer>
            </blockquote>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-3">
              <h2 className="font-exo text-2xl font-bold text-primary">Presenteeism</h2>
              <p className="text-muted-foreground">
                <strong>57 work days lost/year</strong>
                <br />
                60% of employees affected.
              </p>
            </div>
            <div className="space-y-3">
              <h2 className="font-exo text-2xl font-bold text-primary">Absenteeism</h2>
              <p className="text-muted-foreground">
                <strong>17.5% of sick leaves</strong> due to mental health, 43.3 days/year avg.
              </p>
            </div>
            <div className="space-y-3">
              <h2 className="font-exo text-2xl font-bold text-primary">Turnover</h2>
              <p className="text-muted-foreground">
                Cost up to <strong>2.3x more</strong> than providing support; turnover reduction up to 60%.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-4 pt-8 sm:flex-row">
            <Button asChild size="lg" className="bg-primary">
              <Link href="/brain-experience">Find out how to solve this problem</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5">
              <Link href="/brain-experience">Know more about our solution</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
