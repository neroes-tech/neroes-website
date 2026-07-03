import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sport — Services",
  description:
    "The technology behind the Neroes Mental Training Platform: neurofeedback and an EEG headset turned into an intuitive training game.",
};

export default function SportServicesPage() {
  return (
    <>
      <section className="bg-background py-24">
        <div className="container mx-auto max-w-4xl px-4 text-center md:px-6">
          <h1 className="mb-6 font-exo text-4xl font-bold text-primary md:text-5xl">
            We merged scientific knowledge with the possibilities of smart algorithms
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            The result is an interactive software aimed to be used as a videogame: simple, pleasant and
            user-friendly. With the help of an EEG headset, the mind becomes the only input needed to play
            the game.
          </p>
        </div>
      </section>

      <section className="bg-muted py-20">
        <div className="container mx-auto max-w-4xl px-4 text-center md:px-6">
          <h2 className="mb-4 font-exo text-3xl font-bold text-primary">
            What is the technology behind Neroes MTP?
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            The Neroes Mental Training Platform&trade; makes use of neurofeedback technology to access
            specific brainwaves related to stress and anxiety with the help of an EEG headset. Using
            advanced algorithms, the platform translates the evaluated data into an intuitive visual and
            auditory gameflow which tells the user whether a desired state of mind &mdash; the goal &mdash;
            is indeed being achieved.
          </p>
        </div>
      </section>

      <section className="bg-background py-20 text-center">
        <div className="container mx-auto max-w-2xl px-4 md:px-6">
          <h2 className="mb-2 font-exo text-2xl font-bold text-primary">Pricing depends on your club&apos;s needs</h2>
          <p className="mb-8 text-muted-foreground">
            Every engagement is scoped to squad size and season goals. Get in touch and we&apos;ll put
            together a plan.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-secondary font-semibold text-white hover:bg-secondary/90">
              <Link href="/contact">Talk to us!</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5">
              <Link href="/sport/science">See the results</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
