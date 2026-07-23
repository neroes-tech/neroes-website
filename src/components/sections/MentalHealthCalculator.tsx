"use client";

import { useMemo, useState } from "react";

type BiomarkerKey = "emotionalControl" | "decisionVelocity" | "selfConfidence" | "anxietyReduction";

interface Biomarker {
  key: BiomarkerKey;
  label: string;
  weight: number;
  maxGainLabel: string;
}

// Pesos e ganhos máximos documentados nos estudos de caso Neroes (ver
// docs/content-inventory.md, secção "Estatísticas"). Os pesos somam 1.00,
// por isso a média ponderada dos sliders (0-1) mapeia linearmente para 1.00-10.00.
const BIOMARKERS: Biomarker[] = [
  { key: "emotionalControl", label: "Controlo Emocional", weight: 0.4, maxGainLabel: "+111%" },
  { key: "decisionVelocity", label: "Velocidade de Decisão", weight: 0.25, maxGainLabel: "+21.7%" },
  { key: "selfConfidence", label: "Autoconfiança", weight: 0.15, maxGainLabel: "+9.4%" },
  { key: "anxietyReduction", label: "Redução de Ansiedade", weight: 0.2, maxGainLabel: "-14.2%" },
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
  const [state, setState] = useState<SliderState>(INITIAL_STATE);
  const score = useMemo(() => computeMentalScore(state), [state]);

  return (
    <section className="border-t border-border bg-card py-24" aria-labelledby="mental-score-heading">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-blue/30 bg-brand-blue/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-brand-blue">
          Simulador de Performance Neural
        </div>
        <h2 id="mental-score-heading" className="font-exo text-3xl font-bold text-foreground md:text-4xl">
          Demonstrativo — não é um diagnóstico clínico
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Ajusta os sliders para simular o teu progresso em cada indicador, até ao ganho máximo já
          documentado nos nossos estudos de caso. O score combina os quatro indicadores com o peso
          usado no nosso painel de telemetria interno.
        </p>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="space-y-8">
            {BIOMARKERS.map((biomarker) => (
              <div key={biomarker.key}>
                <div className="mb-2 flex items-baseline justify-between gap-4">
                  <label htmlFor={biomarker.key} className="text-sm font-semibold text-foreground">
                    {biomarker.label}
                  </label>
                  <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                    até {biomarker.maxGainLabel} · peso {(biomarker.weight * 100).toFixed(0)}%
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
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/50">Mental Score</p>
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
            <p className="mt-6 text-xs leading-relaxed text-white/40">
              Simulação ilustrativa baseada nos ganhos médios documentados nos estudos de caso Neroes.
              Não substitui avaliação clínica ou psicológica profissional.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
