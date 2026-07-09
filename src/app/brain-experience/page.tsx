import type { Metadata } from "next";

import { Reveal } from "@/components/home/Reveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StarRating } from "@/components/ui/StarRating";
import { CALENDLY_URL, TESTIMONIALS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Brain Experience",
  description:
    "The Brain Experience — a 1-day mental health event for corporate teams. Individual 30-minute experiences for up to 20 employees.",
};

const STATS = [
  { end: 1034, suffix: "", label: "People Experienced", color: "text-primary" },
  { end: 96, suffix: "+", label: "Corporations", color: "text-primary" },
  { end: 92, suffix: "%", label: "Promoter Score", color: "text-secondary" },
] as const;

export default function BrainExperience() {
  return (
    <>
      <PageHero
        variant="decorative"
        maxWidth="4xl"
        title="THE BRAIN EXPERIENCE™"
        subtitle={
          <>
            <span className="block font-exo text-2xl font-bold text-secondary md:text-4xl">
              1-Day Mental Health Event for Corporate
            </span>
            <span className="mx-auto mt-6 block max-w-3xl text-xl">
              This 1-day corporate event allows up to 20 employees to have an individual experience
              that lasts for 30 minutes. Each experience is comprised of 2 parts: Drive with Your
              Mind / Brain Training Demo.
            </span>
          </>
        }
        cta={
          <Button
            asChild
            size="lg"
            className="h-14 rounded-full bg-secondary px-8 text-lg font-semibold text-secondary-foreground transition-shadow hover:bg-secondary/90 hover:shadow-glow-secondary"
          >
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              Schedule Brain Experience
            </a>
          </Button>
        }
      />

      <section className="border-b border-border bg-background py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 text-center md:grid-cols-3">
            {STATS.map(({ end, suffix, label, color }, i) => (
              <Reveal key={label} delay={i * 0.08} className="space-y-2">
                <div className={`font-exo text-5xl font-bold md:text-6xl ${color}`}>
                  <AnimatedCounter end={end} suffix={suffix} />
                </div>
                <p className="text-lg font-medium uppercase tracking-wide text-muted-foreground">
                  {label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-4xl space-y-12">
            <Reveal>
              <SectionHeading
                title="Even Rock in Rio wanted to try!"
                intro={
                  <>
                    Video coming soon &mdash; ask us for a live demo at{" "}
                    <a href="mailto:info@neroes.tech" className="text-secondary hover:underline">
                      info@neroes.tech
                    </a>
                    .
                  </>
                }
                className="mb-0"
              />
            </Reveal>
            <Reveal>
              <div className="relative space-y-6 overflow-hidden rounded-2xl bg-primary p-8 text-center text-primary-foreground md:p-12">
                <div
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-secondary to-transparent"
                />
                <SectionHeading tone="inverted" title="Investment" className="mb-0" />
                <p className="font-exo text-6xl font-bold text-secondary">1500&euro;</p>
                <p className="font-medium text-primary-foreground/80">
                  Cancel for free whenever you want.
                </p>
                <div className="pt-4">
                  <Button
                    asChild
                    size="lg"
                    className="h-14 w-full rounded-full bg-primary-foreground px-8 text-lg font-semibold text-primary hover:bg-primary-foreground/90 sm:w-auto"
                  >
                    <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
                      Book Now
                    </a>
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="container mx-auto px-4 md:px-6">
          <Reveal>
            <SectionHeading title="What they say" className="mb-16" />
          </Reveal>
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08} className="h-full">
                <Card className="h-full border-border bg-card shadow-sm">
                  <CardContent className="flex h-full flex-col justify-between space-y-6 pt-8">
                    <div className="space-y-3">
                      <StarRating />
                      <p className="italic text-muted-foreground">&ldquo;{t.content}&rdquo;</p>
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{t.name}</p>
                      <p className="text-sm text-secondary">{t.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
