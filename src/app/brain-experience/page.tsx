import type { Metadata } from "next";

import { Reveal } from "@/components/home/Reveal";
import { ClientTestimonials } from "@/components/sections/ClientTestimonials";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CALENDLY_URL } from "@/lib/constants";
import { BrainExperienceVideo } from "./BrainExperienceVideo";

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
          <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <BrainExperienceVideo />
            </Reveal>

            <Reveal delay={0.1} className="space-y-10">
              <SectionHeading title="Even Rock in Rio wanted to try!" className="mb-0" />
              <div className="grid grid-cols-3 gap-6 text-center">
                {STATS.map(({ end, suffix, label, color }, i) => (
                  <Reveal key={label} delay={0.1 + i * 0.08} className="space-y-2">
                    <div className={`font-exo text-3xl font-bold md:text-4xl ${color}`}>
                      <AnimatedCounter end={end} suffix={suffix} />
                    </div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground md:text-sm">
                      {label}
                    </p>
                  </Reveal>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <ClientTestimonials />
    </>
  );
}
