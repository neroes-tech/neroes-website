"use client";

import { Gamepad2, LineChart, Waves } from "lucide-react";

import { Reveal } from "@/components/home/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

// Mapeamento direto aos 3 blocos verificados em docs/content-inventory.md
// ("como funciona" / "objetivo do jogo" / "porque é desafiante"), com o
// enquadramento visual SENSE / TRAIN / MEASURE. Text comes from the
// translations dictionary (t.home.pillars); numeral/key/icon stay fixed.
const PILLAR_META = [
  { numeral: "I", key: "SENSE", icon: Waves },
  { numeral: "II", key: "TRAIN", icon: Gamepad2 },
  { numeral: "III", key: "MEASURE", icon: LineChart },
] as const;

export function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section className="bg-background py-24 md:py-32" aria-labelledby="how-it-works-heading">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <h2 id="how-it-works-heading" className="font-exo text-3xl font-bold text-foreground md:text-4xl">
            {t.home.howItWorksHeading}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t.home.howItWorksSubtitlePrefix} <span lang="en">calm, focus, or performance</span>.
          </p>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
          {PILLAR_META.map(({ numeral, key, icon: Icon }, i) => (
            <Reveal key={key} delay={i * 0.1} className="h-full">
              <div className="h-full rounded-3xl border border-border bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-glow-primary">
                <div className="flex items-center gap-3">
                  <span className="font-exo text-sm font-bold text-muted-foreground/50">{numeral}</span>
                  <div className="inline-flex rounded-xl bg-brand-blue/10 p-3">
                    <Icon className="h-6 w-6 text-brand-blue" aria-hidden="true" />
                  </div>
                </div>
                <p className="mt-5 font-exo text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">
                  {key}
                </p>
                <h3 className="mt-2 font-exo text-xl font-bold text-foreground">{t.home.pillars[i]!.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{t.home.pillars[i]!.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
