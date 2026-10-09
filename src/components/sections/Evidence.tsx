"use client";

import { BIG_NUMBER } from "@/components/home/figures";
import { FocusReveal } from "@/components/motion/FocusReveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Rich } from "@/components/ui/Rich";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

/**
 * The Home's evidence section, on the star field (after Pedro's design of
 * 8 Oct 2026): the statement, the lead result at monumental size and weight,
 * then each study as a row — the figure large and bold and what it measured
 * — and how to see it live.
 */
export function Evidence({ className }: { className?: string }) {
  const { t } = useLanguage();
  const ev = t.shared.evidence;

  return (
    <section id="evidencia" aria-labelledby="evidence-heading" className={cn("scroll-mt-24 py-24 text-white md:py-36", className)}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl">
          <Eyebrow tone="vivid" className="mb-6">
            {ev.eyebrow}
          </Eyebrow>
          <FocusReveal>
            <h2 id="evidence-heading" className="font-exo text-5xl font-bold leading-[1.02] tracking-[-0.04em] md:text-7xl">
              {ev.title}
            </h2>
          </FocusReveal>
        </div>

        {/* Lead result */}
        <div className="mt-16 grid items-end gap-8 md:mt-24 lg:grid-cols-12 lg:gap-12">
          <p className={cn(BIG_NUMBER, "text-[clamp(7rem,26vw,19rem)] lg:col-span-7")}>{ev.leadValue}</p>
          <div className="lg:col-span-5 lg:pb-6">
            <p className="text-2xl font-light leading-snug md:text-3xl">{ev.leadLabel}</p>
            <p className="mt-4 text-xs font-bold uppercase leading-relaxed tracking-[0.12em] text-white/65">{ev.leadSource}</p>
          </div>
        </div>

        {/* Further studies, one row each */}
        <dl className="mt-20 divide-y divide-white/12 border-y border-white/12 md:mt-28">
          {ev.studies.map((study) => (
            <div key={study.value} className="grid gap-4 py-8 md:grid-cols-12 md:items-baseline md:gap-8 md:py-10">
              <dt className="font-exo text-6xl font-bold leading-none tracking-[-0.04em] tabular-nums text-brand-vivid md:col-span-3 md:text-7xl">
                {study.value}
              </dt>
              <dd className="text-lg font-light leading-relaxed text-white/85 md:col-span-9 md:text-xl">
                <Rich text={study.desc} tone="inverse" />
              </dd>
            </div>
          ))}
        </dl>

        {/* Seeing it live */}
        <div className="mt-16 max-w-2xl">
          <div>
            <h3 className="text-base font-bold">{ev.liveTitle}</h3>
            <p className="mt-3 leading-relaxed text-white/75">
              <Rich text={ev.liveBody} tone="inverse" />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
