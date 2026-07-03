import type { Metadata } from "next";

import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CALENDLY_URL, TESTIMONIALS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Brain Experience",
  description:
    "The Brain Experience — a 1-day mental health event for corporate teams. Individual 30-minute experiences for up to 20 employees.",
};

export default function BrainExperience() {
  return (
    <>
      <section className="relative overflow-hidden bg-primary py-24 text-primary-foreground">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary/20 via-primary to-primary" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="mx-auto max-w-4xl space-y-8 text-center">
            <h1 className="font-exo text-4xl font-bold leading-tight md:text-6xl">
              THE BRAIN EXPERIENCE&trade;
              <span className="mt-2 block font-exo text-2xl text-secondary md:text-4xl">
                1-Day Mental Health Event for Corporate
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-primary-foreground/80">
              This 1-day corporate event allows up to 20 employees to have an individual experience that lasts
              for 30 minutes. Each experience is comprised of 2 parts: Drive with Your Mind / Brain Training Demo.
            </p>
            <div className="pt-8">
              <Button asChild size="lg" className="h-14 bg-secondary px-8 text-lg font-semibold text-white hover:bg-secondary/90">
                <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
                  Schedule Brain Experience
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 text-center md:grid-cols-3">
            {[
              { end: 1034, suffix: "", label: "People Experienced", color: "text-primary" },
              { end: 96, suffix: "+", label: "Corporations", color: "text-primary" },
              { end: 92, suffix: "%", label: "Promoter Score", color: "text-secondary" },
            ].map(({ end, suffix, label, color }) => (
              <div key={label} className="space-y-2">
                <div className={`font-exo text-5xl font-bold md:text-6xl ${color}`}>
                  <AnimatedCounter end={end} suffix={suffix} />
                </div>
                <p className="text-lg font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-4xl space-y-12">
            <div className="space-y-4 text-center">
              <h2 className="font-exo text-3xl font-bold text-primary">Even Rock in Rio wanted to try!</h2>
              <p className="text-muted-foreground">
                Video coming soon &mdash; ask us for a live demo at{" "}
                <a href="mailto:info@neroes.tech" className="text-secondary hover:underline">
                  info@neroes.tech
                </a>
                .
              </p>
            </div>
            <div className="relative space-y-6 overflow-hidden rounded-2xl bg-primary p-8 text-center text-primary-foreground md:p-12">
              <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-secondary to-transparent" />
              <h2 className="font-exo text-3xl font-bold">Investment</h2>
              <p className="font-exo text-6xl font-bold text-secondary">1500&euro;</p>
              <p className="font-medium text-primary-foreground/80">Cancel for free whenever you want.</p>
              <div className="pt-4">
                <Button asChild size="lg" className="w-full bg-white font-semibold text-primary hover:bg-white/90 sm:w-auto">
                  <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
                    Book Now
                  </a>
                </Button>
              </div>
            </div>
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
