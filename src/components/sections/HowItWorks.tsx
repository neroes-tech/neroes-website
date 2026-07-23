import { Gamepad2, LineChart, Waves } from "lucide-react";

import { Reveal } from "@/components/home/Reveal";

// Mapeamento direto aos 3 blocos verificados em docs/content-inventory.md
// ("como funciona" / "objetivo do jogo" / "porque é desafiante"), com o
// enquadramento visual SENSE / TRAIN / MEASURE.
const PILLARS = [
  {
    numeral: "I",
    key: "SENSE",
    icon: Waves,
    title: "Captação de sinal",
    body: "Headsets EEG e biossensores leem o teu estado cerebral várias vezes por segundo — a mesma leitura em tempo real usada no headset Neroes.",
  },
  {
    numeral: "II",
    key: "TRAIN",
    icon: Gamepad2,
    title: "Treino adaptativo",
    body: "Um jogo orientado por IA ajusta o desafio em tempo real conforme os teus sinais: o objetivo é simples — mantém-te calmo e focado para avançar.",
  },
  {
    numeral: "III",
    key: "MEASURE",
    icon: LineChart,
    title: "Evolução e métricas",
    body: "Os sinais cerebrais são monitorizados sessão após sessão e transformados em métricas objetivas — a mesma visualização clínica que usamos para provar resultados reais.",
  },
] as const;

export function HowItWorks() {
  return (
    <section className="bg-background py-24 md:py-32" aria-labelledby="how-it-works-heading">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <h2 id="how-it-works-heading" className="font-exo text-3xl font-bold text-foreground md:text-4xl">
            Como funciona
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Treino de redes neurais focado em <span lang="en">calm, focus, or performance</span>.
          </p>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
          {PILLARS.map(({ numeral, key, icon: Icon, title, body }, i) => (
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
                <h3 className="mt-2 font-exo text-xl font-bold text-foreground">{title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
