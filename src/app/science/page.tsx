import type { Metadata } from "next";
import Link from "next/link";
import { Activity, Brain, LineChart } from "lucide-react";

import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Science",
  description:
    "The neuroscience behind the Neroes Mental Training Platform: EEG-based neurofeedback for measurable improvements in emotional control and decision-making.",
};

export default function SciencePage() {
  return (
    <>
      <section className="bg-background py-24">
        <div className="container mx-auto max-w-4xl px-4 text-center md:px-6">
          <h1 className="mb-6 font-exo text-4xl font-bold text-primary md:text-5xl">
            The neuroscience behind Neroes
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            The Neroes Mental Training Platform&trade; would be impossible without extensive research and
            validated studies about mental health and its effects on human performance.
          </p>
        </div>
      </section>

      <section className="bg-muted py-20">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <div className="space-y-3 text-center">
              <Brain className="mx-auto h-10 w-10 text-secondary" aria-hidden="true" />
              <h2 className="font-exo text-xl font-bold text-foreground">EEG signal capture</h2>
              <p className="text-sm text-muted-foreground">
                A wearable electroencephalography (EEG) headset reads the brain&apos;s electrical activity in
                real time.
              </p>
            </div>
            <div className="space-y-3 text-center">
              <Activity className="mx-auto h-10 w-10 text-secondary" aria-hidden="true" />
              <h2 className="font-exo text-xl font-bold text-foreground">Neurofeedback training</h2>
              <p className="text-sm text-muted-foreground">
                Those signals control a videogame that can only be won by genuinely reaching a calmer,
                more focused state of mind.
              </p>
            </div>
            <div className="space-y-3 text-center">
              <LineChart className="mx-auto h-10 w-10 text-secondary" aria-hidden="true" />
              <h2 className="font-exo text-xl font-bold text-foreground">Measured progress</h2>
              <p className="text-sm text-muted-foreground">
                Adaptive algorithms track each user&apos;s evolution across sessions, making training more
                demanding as skills improve.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="mb-12 text-center font-exo text-3xl font-bold text-primary">
            Results observed in corporate teams
          </h2>
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 text-center md:grid-cols-4">
            {[
              { prefix: "+", end: 111, suffix: "%", label: "Emotional Control" },
              { prefix: "+", end: 21, suffix: ".7%", label: "Decision Making Velocity" },
              { prefix: "+", end: 9, suffix: ".4%", label: "Self-confidence" },
              { prefix: "-", end: 14, suffix: ".2%", label: "Anxiety" },
            ].map(({ prefix, end, suffix, label }) => (
              <div key={label} className="space-y-2">
                <div className="font-exo text-4xl font-bold text-primary md:text-5xl">
                  <AnimatedCounter prefix={prefix} end={end} suffix={suffix} />
                </div>
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted py-20 text-center">
        <div className="container mx-auto max-w-2xl px-4 md:px-6">
          <p className="mb-6 text-lg text-muted-foreground">
            Curious how this works for elite sports teams instead?
          </p>
          <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5">
            <Link href="/sport/science">See the Sport Science case study</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
