import type { Metadata } from "next";
import Link from "next/link";
import { Activity, Brain, LineChart } from "lucide-react";

import { Reveal } from "@/components/home/Reveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Science",
  description:
    "The neuroscience behind the Neroes Mental Training Platform: EEG-based neurofeedback for measurable improvements in emotional control and decision-making.",
};

const PILLARS = [
  {
    icon: Brain,
    title: "EEG signal capture",
    desc: "A wearable electroencephalography (EEG) headset reads the brain's electrical activity in real time.",
  },
  {
    icon: Activity,
    title: "Neurofeedback training",
    desc: "Those signals control a videogame that can only be won by genuinely reaching a calmer, more focused state of mind.",
  },
  {
    icon: LineChart,
    title: "Measured progress",
    desc: "Adaptive algorithms track each user's evolution across sessions, making training more demanding as skills improve.",
  },
] as const;

const STATS = [
  { prefix: "+", end: 111, suffix: "%", label: "Emotional Control", color: "text-primary" },
  { prefix: "+", end: 21, suffix: ".7%", label: "Decision Making Velocity", color: "text-primary" },
  { prefix: "+", end: 9, suffix: ".4%", label: "Self-confidence", color: "text-primary" },
  { prefix: "-", end: 14, suffix: ".2%", label: "Anxiety", color: "text-secondary" },
] as const;

export default function SciencePage() {
  return (
    <>
      <PageHero
        eyebrow="Science"
        title="The neuroscience behind Neroes"
        subtitle={
          <>
            The Neroes Mental Training Platform&trade; would be impossible without extensive research
            and validated studies about mental health and its effects on human performance.
          </>
        }
        maxWidth="4xl"
      />

      <section className="bg-muted py-24">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {PILLARS.map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 0.08} className="h-full">
                <Card className="h-full border-border bg-card text-center shadow-sm transition-shadow duration-300 hover:shadow-glow-primary">
                  <CardContent className="space-y-4 pt-8">
                    <div className="mx-auto inline-flex rounded-xl bg-secondary/10 p-3">
                      <Icon className="h-7 w-7 text-secondary" aria-hidden="true" />
                    </div>
                    <h2 className="font-exo text-xl font-bold text-foreground">{title}</h2>
                    <p className="leading-relaxed text-muted-foreground">{desc}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <Reveal>
            <SectionHeading title="Results observed in corporate teams" />
          </Reveal>
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 text-center md:grid-cols-4">
            {STATS.map(({ prefix, end, suffix, label, color }, i) => (
              <Reveal key={label} delay={i * 0.08} className="space-y-2">
                <div className={`font-exo text-4xl font-bold md:text-5xl ${color}`}>
                  <AnimatedCounter prefix={prefix} end={end} suffix={suffix} />
                </div>
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-border bg-card py-24">
        <div
          aria-hidden="true"
          className="bg-neural-grid pointer-events-none absolute inset-0 text-primary/10"
        />
        <div className="container relative mx-auto max-w-2xl px-4 text-center md:px-6">
          <Reveal>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              Curious how this works for elite sports teams instead?
            </p>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 rounded-full border-primary px-8 text-lg text-primary hover:bg-primary/5"
            >
              <Link href="/sport/science">See the Sport Science case study</Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
