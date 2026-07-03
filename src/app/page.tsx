import Link from "next/link";
import type { Metadata } from "next";
import { Activity, Brain, Heart, Moon, Shield, Target, TrendingUp, Users, Zap } from "lucide-react";

import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TESTIMONIALS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Neroes — Mental Training Platform",
  description:
    "Would you like to keep the best people in your company? Give them the tools to be the best version of themselves.",
};

export default function Home() {
  return (
    <>
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        </div>
        <div className="container relative z-10 px-4 py-20 text-center md:px-6">
          <div className="mx-auto max-w-4xl space-y-8">
            <h1 className="font-exo text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl">
              Would you like to keep the <span className="text-secondary">best people</span> in your company?
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-muted-foreground md:text-2xl">
              Make them happier while making them better. Give them the tools to be the best version of themselves.
            </p>
            <div className="flex flex-col justify-center gap-4 pt-8 sm:flex-row">
              <Button asChild size="lg" className="h-14 bg-secondary px-8 text-lg font-semibold text-white hover:bg-secondary/90">
                <Link href="/contact">Know more</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 border-primary px-8 text-lg text-primary hover:bg-primary/5">
                <Link href="/science">Science</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary py-24 text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-exo text-3xl font-bold md:text-5xl">The Mental Training Platform&trade;</h2>
            <p className="mx-auto max-w-2xl text-lg text-primary-foreground/80">
              A precision instrument for the human mind.
            </p>
          </div>
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            <Card className="border-primary-foreground/10 bg-primary-foreground/5 text-primary-foreground">
              <CardContent className="space-y-4 pt-8">
                <Brain className="h-12 w-12 text-accent" aria-hidden="true" />
                <h3 className="font-exo text-2xl font-bold">How it works</h3>
                <p className="leading-relaxed text-primary-foreground/80">
                  Using an advanced EEG headset, we monitor brain waves in real-time to provide immediate,
                  actionable feedback on cognitive states.
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary-foreground/10 bg-primary-foreground/5 text-primary-foreground">
              <CardContent className="space-y-4 pt-8">
                <Target className="h-12 w-12 text-accent" aria-hidden="true" />
                <h3 className="font-exo text-2xl font-bold">The goal of the game</h3>
                <p className="leading-relaxed text-primary-foreground/80">
                  Focus and focus better. By eliminating anxiety through gamified neurofeedback, users learn to
                  enter a state of flow on command.
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary-foreground/10 bg-primary-foreground/5 text-primary-foreground">
              <CardContent className="space-y-4 pt-8">
                <Zap className="h-12 w-12 text-accent" aria-hidden="true" />
                <h3 className="font-exo text-2xl font-bold">Why it&apos;s challenging</h3>
                <p className="leading-relaxed text-primary-foreground/80">
                  It&apos;s a game controlled entirely by brain waves. You cannot cheat the system; you must
                  genuinely achieve emotional regulation to win.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2">
            <div className="space-y-8">
              <h2 className="font-exo text-4xl font-bold text-primary">Benefits</h2>
              <div className="space-y-6">
                {[
                  { icon: Users, title: "Organizational health", desc: "Fostering better team workers and cohesive dynamics." },
                  { icon: TrendingUp, title: "Increased Productivity", desc: "Driving output higher while significantly reducing mistakes." },
                  { icon: Heart, title: "Personal development", desc: "Cultivating happier, more fulfilled individuals." },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="rounded-lg bg-secondary/10 p-3">
                      <Icon className="h-6 w-6 text-secondary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{title}</h3>
                      <p className="mt-1 text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-8">
              <h2 className="font-exo text-4xl font-bold text-primary">Features</h2>
              <div className="space-y-6">
                {[
                  { icon: Shield, title: "Better Communication", desc: "Enhancing leadership and interpersonal skills." },
                  { icon: Activity, title: "Better Performance", desc: "Sustained high-level execution under pressure." },
                  { icon: Moon, title: "Sleep quality", desc: "Improving general wellbeing and recovery." },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="rounded-lg bg-accent/10 p-3">
                      <Icon className="h-6 w-6 text-accent" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{title}</h3>
                      <p className="mt-1 text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 text-center md:grid-cols-4">
            {[
              { prefix: "+", end: 111, suffix: "%", label: "Emotional Control", color: "text-primary" },
              { prefix: "+", end: 21, suffix: ".7%", label: "Decision Making Velocity", color: "text-primary" },
              { prefix: "+", end: 9, suffix: ".4%", label: "Self-confidence", color: "text-primary" },
              { prefix: "-", end: 14, suffix: ".2%", label: "Anxiety", color: "text-secondary" },
            ].map(({ prefix, end, suffix, label, color }) => (
              <div key={label} className="space-y-2">
                <div className={`font-exo text-5xl font-bold md:text-6xl ${color}`}>
                  <AnimatedCounter prefix={prefix} end={end} suffix={suffix} />
                </div>
                <p className="text-lg font-medium text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="container px-4 md:px-6">
          <div className="mb-16 text-center">
            <h2 className="font-exo text-4xl font-bold text-primary">What they say</h2>
          </div>
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name} className="border-border bg-card shadow-sm">
                <CardContent className="flex h-full flex-col justify-between space-y-6 pt-8">
                  <p className="italic text-muted-foreground">&ldquo;{t.content}&rdquo;</p>
                  <div>
                    <p className="font-bold text-foreground">{t.name}</p>
                    <p className="text-sm text-secondary">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
