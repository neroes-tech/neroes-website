"use client";

import { BlurReveal } from "@/components/motion/BlurReveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Rich } from "@/components/ui/Rich";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

/**
 * The Home's evidence section (Pedro's "The Evidence"), on the stone tint:
 * the statement coming into focus, the lead result very large in the brand
 * blue (5.1:1 on stone — the logo's vivid blue would fail as text here), then
 * each study with what it measures and how, and how to read it all.
 */
export function Evidence({ className }: { className?: string }) {
  const { t } = useLanguage();
  const ev = t.shared.evidence;

  return (
    <section
      id="evidencia"
      aria-labelledby="evidence-heading"
      className={cn("scroll-mt-24 bg-muted py-24 text-foreground md:py-36", className)}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-5xl text-center">
          <Eyebrow className="mb-6">{ev.eyebrow}</Eyebrow>
          <BlurReveal>
            <h2
              id="evidence-heading"
              className="font-exo text-5xl font-light leading-[1.05] tracking-[-0.04em] md:text-7xl lg:text-[5.5rem]"
            >
              {ev.title}
            </h2>
          </BlurReveal>
        </div>

        {/* Lead result */}
        <div className="mx-auto mt-20 max-w-3xl text-center md:mt-28">
          <p className="font-exo text-[6.5rem] font-light leading-none tracking-[-0.05em] text-secondary tabular-nums md:text-[11rem]">
            {ev.leadValue}
          </p>
          <p className="mt-4 text-2xl font-light leading-snug md:text-3xl">{ev.leadLabel}</p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">{ev.leadSource}</p>
        </div>

        {/* Further studies */}
        <dl className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:mt-28 md:grid-cols-3">
          {ev.studies.map((study) => (
            <div key={study.value} className="flex flex-col gap-3 bg-background p-7 md:p-8">
              <dt className="font-exo text-5xl font-light leading-none tracking-[-0.04em] tabular-nums">{study.value}</dt>
              <dd className="leading-relaxed text-muted-foreground">
                <Rich text={study.desc} />
              </dd>
              <dd className="mt-auto pt-2 text-xs font-bold uppercase leading-relaxed tracking-[0.1em] text-muted-foreground">
                {study.method}
              </dd>
            </div>
          ))}
        </dl>

        {/* How to read them */}
        <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <h3 className="text-base font-bold">{ev.honestTitle}</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              <Rich text={ev.honestBody} />
            </p>
          </div>
          <div>
            <h3 className="text-base font-bold">{ev.liveTitle}</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              <Rich text={ev.liveBody} />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
