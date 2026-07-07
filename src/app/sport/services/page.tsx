import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/home/Reveal";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Sport — Services",
  description:
    "The technology behind the Neroes Mental Training Platform: neurofeedback and an EEG headset turned into an intuitive training game.",
};

export default function SportServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Sport services"
        title="We merged scientific knowledge with the possibilities of smart algorithms"
        subtitle="The result is an interactive software aimed to be used as a videogame: simple, pleasant and user-friendly. With the help of an EEG headset, the mind becomes the only input needed to play the game."
        maxWidth="4xl"
      />

      <section className="bg-muted py-24">
        <div className="container mx-auto max-w-4xl px-4 md:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="How it works"
              title="What is the technology behind Neroes MTP?"
              intro={
                <>
                  The Neroes Mental Training Platform&trade; makes use of neurofeedback technology to
                  access specific brainwaves related to stress and anxiety with the help of an EEG
                  headset. Using advanced algorithms, the platform translates the evaluated data into an
                  intuitive visual and auditory gameflow which tells the user whether a desired state of
                  mind &mdash; the goal &mdash; is indeed being achieved.
                </>
              }
              className="mb-0"
            />
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-border bg-card py-24">
        <div
          aria-hidden="true"
          className="bg-neural-grid pointer-events-none absolute inset-0 text-primary/10"
        />
        <div className="container relative mx-auto max-w-2xl px-4 text-center md:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Pricing"
              title="Pricing depends on your club's needs"
              intro={
                <>
                  Every engagement is scoped to squad size and season goals. Get in touch and we&apos;ll
                  put together a plan.
                </>
              }
              className="mb-10"
            />
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-14 rounded-full bg-secondary px-8 text-lg font-semibold text-secondary-foreground transition-shadow hover:bg-secondary/90 hover:shadow-glow-secondary"
              >
                <Link href="/contact">Talk to us!</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 rounded-full border-primary px-8 text-lg text-primary hover:bg-primary/5"
              >
                <Link href="/sport/science">See the results</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
