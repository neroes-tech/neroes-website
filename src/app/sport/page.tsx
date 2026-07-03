import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PARTNERS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sport",
  description:
    "Stress and anxiety alone are the main reasons for failure by professional athletes. Neroes gives them tools to better control their mental performance.",
};

export default function SportPage() {
  return (
    <>
      <section className="bg-background py-24">
        <div className="container mx-auto max-w-4xl px-4 text-center md:px-6">
          <h1 className="mb-6 font-exo text-4xl font-bold text-primary md:text-5xl">
            We all come across athletes that crack under pressure
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Stress and anxiety alone are the main reasons for failure by professional athletes. We need to
            give them tools to better control their own mental performance.
          </p>
        </div>
      </section>

      <section className="bg-muted py-20">
        <div className="container mx-auto max-w-4xl px-4 text-center md:px-6">
          <h2 className="mb-4 font-exo text-3xl font-bold text-primary">
            How does the Neroes Mental Training Platform&trade; work?
          </h2>
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
            Using the most state-of-the-art digital neurotechnologies, we developed an interactive training
            that enhances the performance of elite athletes by working their mind skills. With an EEG
            headset and computer software, the athlete plays a video game which can only be won by reaching
            desired states of mind.
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { title: "Non-invasive", desc: "The user has full control of mind & body through the training" },
              { title: "Self-progressing", desc: "Intuitive interaction guides the user throughout the whole process" },
              { title: "Easy & autonomous", desc: "The interactive platform is self-learning and serves for long-term training" },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-2 font-exo font-bold uppercase tracking-wide text-secondary">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="container mx-auto max-w-4xl px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-2 text-lg font-bold text-foreground">
                How can a software detect a person&apos;s state of mind?
              </h2>
              <p className="text-muted-foreground">
                Electroencephalography technology detects particular brainwaves which are related to
                different states of mind, such as stress and anxiety.
              </p>
            </div>
            <div>
              <h2 className="mb-2 text-lg font-bold text-foreground">
                Can a video game really be considered training?
              </h2>
              <p className="text-muted-foreground">
                Yes. Adaptive algorithms analyse the athlete&apos;s evolution, so that each level becomes
                more demanding and personally challenging.
              </p>
            </div>
          </div>
          <div className="mt-10 text-center">
            <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5">
              <Link href="/sport/science">The technology of Neroes MTP&trade;</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-primary py-24 text-primary-foreground">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-2 font-exo text-3xl font-bold">The final kick your athletes were missing</h2>
            <p className="text-primary-foreground/80">
              The Neroes Mental Training Platform&trade; was made to push your athletes to the next level:
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
            <Card className="border-primary-foreground/10 bg-primary-foreground/5 text-primary-foreground">
              <CardContent className="space-y-2 pt-6">
                <p className="font-exo text-2xl font-bold text-secondary">+4% performance improvement</p>
                <p className="text-sm text-primary-foreground/80">
                  Up to more than 900 successful passes, dribbles, and shots in a football team.
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary-foreground/10 bg-primary-foreground/5 text-primary-foreground">
              <CardContent className="space-y-2 pt-6">
                <p className="font-exo text-2xl font-bold text-secondary">21.7% Faster Decision Making</p>
                <p className="text-sm text-primary-foreground/80">
                  Decision-making mental efficiency allows for executing quickly and clearly on the field.
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary-foreground/10 bg-primary-foreground/5 text-primary-foreground">
              <CardContent className="space-y-2 pt-6">
                <p className="font-exo text-2xl font-bold text-secondary">9.4% Self-confidence boost</p>
                <p className="text-sm text-primary-foreground/80">
                  Self-confidence creates higher focus, motivation & mental toughness.
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary-foreground/10 bg-primary-foreground/5 text-primary-foreground">
              <CardContent className="space-y-2 pt-6">
                <p className="font-exo text-2xl font-bold text-secondary">Faster recovery & injury reduction</p>
                <p className="text-sm text-primary-foreground/80">
                  Lower anxiety levels (up to 14% in 10 sessions) help decrease muscular injury and
                  accelerate recovery.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="container mx-auto max-w-4xl px-4 text-center md:px-6">
          <h2 className="mb-8 font-exo text-3xl font-bold text-primary">
            It&apos;s not only the athletes we&apos;re talking about &mdash; make your club a winner
          </h2>
          <div className="grid gap-6 text-left sm:grid-cols-3">
            <div>
              <h3 className="mb-1 font-bold text-foreground">Team adaptability and transition flow</h3>
              <p className="text-sm text-muted-foreground">
                Improve your athletes&apos; adaptability to new circumstances and boost transitioning from
                youth to professional level.
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-bold text-foreground">Minimal risk</h3>
              <p className="text-sm text-muted-foreground">
                3 months of Neroes MTP&trade; will give you noticeable results, with a reduced investment.
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-bold text-foreground">Invest on winning, money back</h3>
              <p className="text-sm text-muted-foreground">
                Maximize your athletes&apos; potential and boost their chances of investment return and
                sponsorship.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-20">
        <div className="container mx-auto max-w-3xl px-4 text-center md:px-6">
          <blockquote className="space-y-4">
            <p className="text-xl italic leading-relaxed text-foreground">
              &ldquo;With this interactive approach, it is simpler and easier to figure out what has to be
              done to achieve results during the sports competition.&rdquo;
            </p>
            <footer className="font-medium text-muted-foreground">
              &mdash; Jo&atilde;o Cris&oacute;stomo, Judo European Bronze Medal 2021
            </footer>
          </blockquote>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <h2 className="mb-10 text-center font-exo text-2xl font-bold text-primary">
            Many organizations already foresee the benefits of mental enhancement
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {PARTNERS.map((partner) => (
              <a
                key={partner.name}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-muted-foreground transition-colors hover:text-primary"
              >
                {partner.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-20 text-center text-primary-foreground">
        <div className="container mx-auto max-w-2xl px-4 md:px-6">
          <h2 className="mb-2 font-exo text-3xl font-bold">The greatest competitive advantage is brain power.</h2>
          <p className="mb-8 text-primary-foreground/80">Learn how to boost it and reach beyond.</p>
          <Button asChild size="lg" className="bg-secondary font-semibold text-white hover:bg-secondary/90">
            <Link href="/contact">Talk to us!</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
