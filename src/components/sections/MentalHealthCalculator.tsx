"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

type BiomarkerKey = "emotionalControl" | "decisionVelocity" | "selfConfidence" | "anxietyReduction";

interface Biomarker {
  key: BiomarkerKey;
  weight: number;
  maxGainLabel: string;
}

// Pesos e ganhos máximos documentados nos estudos de caso Neroes (ver
// docs/content-inventory.md, secção "Estatísticas"). Os pesos somam 1.00,
// por isso a média ponderada dos sliders (0-1) mapeia linearmente para 1.00-10.00.
const BIOMARKERS: Biomarker[] = [
  { key: "emotionalControl", weight: 0.4, maxGainLabel: "+111%" },
  { key: "decisionVelocity", weight: 0.25, maxGainLabel: "+21.7%" },
  { key: "selfConfidence", weight: 0.15, maxGainLabel: "+9.4%" },
  { key: "anxietyReduction", weight: 0.2, maxGainLabel: "-14.2%" },
];

type SliderState = Record<BiomarkerKey, number>;

const INITIAL_STATE: SliderState = {
  emotionalControl: 50,
  decisionVelocity: 50,
  selfConfidence: 50,
  anxietyReduction: 50,
};

function computeMentalScore(state: SliderState): number {
  const weightedAverage = BIOMARKERS.reduce(
    (sum, biomarker) => sum + (state[biomarker.key] / 100) * biomarker.weight,
    0,
  );
  return Number((1 + weightedAverage * 9).toFixed(2));
}

export function MentalHealthCalculator() {
  const { t } = useLanguage();
  const [state, setState] = useState<SliderState>(INITIAL_STATE);
  const score = useMemo(() => computeMentalScore(state), [state]);

  return (
    <section className="border-t border-border bg-card py-24" aria-labelledby="mental-score-heading">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-blue/30 bg-brand-blue/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-brand-blue">
          {t.mentalScore.badge}
        </div>
        <h2 id="mental-score-heading" className="font-exo text-3xl font-bold text-foreground md:text-4xl">
          {t.mentalScore.heading}
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">{t.mentalScore.description}</p>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="space-y-8">
            {BIOMARKERS.map((biomarker, i) => (
              <div key={biomarker.key}>
                <div className="mb-2 flex items-baseline justify-between gap-4">
                  <label htmlFor={biomarker.key} className="text-sm font-semibold text-foreground">
                    {t.mentalScore.biomarkerLabels[i]}
                  </label>
                  <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                    {t.mentalScore.weightPrefix} {biomarker.maxGainLabel} {t.mentalScore.weightMiddle}{" "}
                    {(biomarker.weight * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  id={biomarker.key}
                  type="range"
                  min={0}
                  max={100}
                  value={state[biomarker.key]}
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, [biomarker.key]: Number(e.target.value) }))
                  }
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-brand-blue"
                  aria-describedby={`${biomarker.key}-value`}
                />
                <span id={`${biomarker.key}-value`} className="sr-only" aria-live="polite">
                  {state[biomarker.key]}%
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-3xl bg-[#1E2233] p-10 text-center shadow-xl">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/50">
              {t.mentalScore.scoreLabel}
            </p>
            <p className="mt-4 font-exo text-6xl font-bold text-white">
              {score.toFixed(2)}
              <span className="text-2xl text-white/40">/10.00</span>
            </p>
            <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-blue via-brand-teal to-brand-violet transition-all duration-300"
                style={{ width: `${(score / 10) * 100}%` }}
              />
            </div>
            <p className="mt-6 text-xs leading-relaxed text-white/40">{t.mentalScore.disclaimer}</p>
          </div>
        </div>

        {/* Real, verified scientific grounding — see docs/content-inventory.md
            for the source facts (IBEB/FCUL partnership, Estoril Praia case
            study, existing testimonials). No unverified claims (e.g. the old
            WordPress site's "Physioma" award mention was a dead link with no
            real substantiation, so it's deliberately left out here). */}
        <div className="mt-10 rounded-3xl border border-border bg-card p-8 shadow-sm md:p-10">
          <h3 className="font-exo text-xl font-bold text-foreground">{t.calculatorScience.heading}</h3>
          <ul className="mt-6 space-y-4 text-muted-foreground">
            {[t.calculatorScience.point1, t.calculatorScience.point2, t.calculatorScience.point3].map(
              (point) => (
                <li key={point} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ),
            )}
          </ul>
          <Link
            href="/science"
            className="mt-6 inline-flex items-center gap-1.5 font-medium text-secondary hover:underline"
          >
            {t.calculatorScience.ctaLabel}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
