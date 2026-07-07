import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/home/Reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PARTNERS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sport",
  description:
    "Stress and anxiety alone are the main reasons for failure by professional athletes. Neroes gives them tools to better control their mental performance.",
};

const HOW_IT_WORKS = [
  { title: "Non-invasive", desc: "The user has full control of mind & body through the training" },
  { title: "Self-progressing", desc: "Intuitive interaction guides the user throughout the whole process" },
  { title: "Easy & autonomous", desc: "The interactive platform is self-learning and serves for long-term training" },
] as const;

const RESULTS = [
  {
    stat: "+4% performance improvement",
    desc: "Up to more than 900 successful passes, dribbles, and shots in a football team.",
  },
  {
    stat: "21.7% Faster Decision Making",
    desc: "Decision-making mental efficiency allows for executing quickly and clearly on the field.",
  },
  {
    stat: "9.4% Self-confidence boost",
    desc: "Self-confidence creates higher focus, motivation & mental toughness.",
  },
  {
    stat: "Faster recovery & injury reduction",
    desc: "Lower anxiety levels (up to 14% in 10 sessions) help decrease muscular injury and accelerate recovery.",
  },
] as const;

const CLUB_BENEFITS = [
  {
    title: "Team adaptability and transition flow",
    desc: "Improve your athletes’ adaptability to new circumstances and boost transitioning from youth to professional level.",
  },
  {
    title: "Minimal risk",
    desc: "3 months of Neroes MTP™ will give you noticeable results, with a reduced investment.",
  },
  {
    title: "Invest on winning, money back",
    desc: "Maximize your athletes’ potential and boost their chances of investment return and sponsorship.",
  },
] as const;

export default function SportPage() {
  return (
    <>
      <PageHero
        eyebrow="Sport"
        title="We all come across athletes that crack under pressure"
        subtitle="Stress and anxiety alone are the main reasons for failure by professional athletes. We need to give them tools to better control their own mental performance."
        maxWidth="4xl"
      />

      <section className="bg-muted py-24">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <Reveal>
            <SectionHeading
              title="How does the Neroes Mental Training Platform™ work?"
              intro="Using the most state-of-the-art digital neurotechnologies, we developed an interactive training that enhances the performance of elite athletes by working their mind skills. With an EEG headset and computer software, the athlete plays a video game which can only be won by reaching desired states of mind."
            />
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-3">
            {HOW_IT_WORKS.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08} className="h-full">
                <Card className="h-full border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-glow-primary">
                  <CardContent className="space-y-2 pt-6 text-center">
                    <h3 className="font-exo font-bold uppercase tracking-wide text-secondary">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="container mx-auto max-w-4xl px-4 md:px-6">
          <div className="grid gap-10 md:grid-cols-2">
            <Reveal>
              <h2 className="mb-3 font-exo text-xl font-bold text-primary">
                How can a software detect a person&apos;s state of mind?
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                Electroencephalography technology detects particular brainwaves which are related to
                different states of mind, such as stress and anxiety.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mb-3 font-exo text-xl font-bold text-primary">
                Can a video game really be considered training?
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                Yes. Adaptive algorithms analyse the athlete&apos;s evolution, so that each level becomes
                more demanding and personally challenging.
              </p>
            </Reveal>
          </div>
          <Reveal className="mt-12 text-center" delay={0.16}>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 rounded-full border-primary px-8 text-lg text-primary hover:bg-primary/5"
            >
              <Link href="/sport/science">The technology of Neroes MTP&trade;</Link>
            </Button>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-muted py-24 md:py-32">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-decorative-violet-soft blur-3xl" />
          <div className="bg-neural-grid absolute inset-0 text-primary/[0.05]" />
        </div>
        <div className="container relative mx-auto max-w-6xl px-4 md:px-6">
          <Reveal>
            <SectionHeading
              title="The final kick your athletes were missing"
              intro="The Neroes Mental Training Platform™ was made to push your athletes to the next level:"
            />
          </Reveal>
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
            {RESULTS.map((item, i) => (
              <Reveal key={item.stat} delay={i * 0.08} className="h-full">
                <Card className="h-full border-border bg-card transition-all hover:-translate-y-1 hover:shadow-glow-secondary">
                  <CardContent className="space-y-2 pt-6">
                    <p className="font-exo text-2xl font-bold text-secondary">{item.stat}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <Reveal>
            <SectionHeading title="It’s not only the athletes we’re talking about — make your club a winner" />
          </Reveal>
          <div className="grid gap-8 sm:grid-cols-3">
            {CLUB_BENEFITS.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <h3 className="mb-2 font-exo text-lg font-bold text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted py-24">
        <div className="container mx-auto max-w-3xl px-4 text-center md:px-6">
          <Reveal>
            <blockquote className="space-y-4">
              <p className="font-exo text-2xl italic leading-relaxed text-primary">
                &ldquo;With this interactive approach, it is simpler and easier to figure out what has to be
                done to achieve results during the sports competition.&rdquo;
              </p>
              <footer className="font-medium text-muted-foreground">
                &mdash; Jo&atilde;o Cris&oacute;stomo, Judo European Bronze Medal 2021
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <Reveal>
            <SectionHeading title="Many organizations already foresee the benefits of mental enhancement" />
            <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
              {PARTNERS.map((partner) => (
                <li key={partner.name}>
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block py-1 font-exo text-xl font-semibold tracking-wide text-muted-foreground transition-colors hover:text-primary"
                  >
                    {partner.name}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-primary py-24 text-primary-foreground md:py-32">
        <div
          aria-hidden="true"
          className="bg-neural-grid pointer-events-none absolute inset-0 text-primary-foreground/10"
        />
        <div className="container relative mx-auto max-w-2xl px-4 text-center md:px-6">
          <Reveal>
            <h2 className="font-exo text-3xl font-bold tracking-tight md:text-4xl">
              The greatest competitive advantage is brain power.
            </h2>
            <p className="mx-auto mt-4 text-lg leading-relaxed text-primary-foreground/80">
              Learn how to boost it and reach beyond.
            </p>
            <div className="mt-10">
              <Button
                asChild
                size="lg"
                className="group h-14 rounded-full bg-secondary px-8 text-lg font-semibold text-secondary-foreground transition-shadow hover:bg-secondary/90 hover:shadow-glow-secondary"
              >
                <Link href="/contact">
                  Talk to us!
                  <ArrowRight
                    className="h-5 w-5 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
