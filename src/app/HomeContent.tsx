"use client";

import Link from "next/link";

import { BIG_NUMBER } from "@/components/home/figures";
import { Hero } from "@/components/home/Hero";
import { PartnerLogos } from "@/components/layout/PartnerLogos";
import { FocusReveal } from "@/components/motion/FocusReveal";
import { ClientTestimonials } from "@/components/sections/ClientTestimonials";
import { Evidence } from "@/components/sections/Evidence";
import { ProductVideo } from "@/components/sections/ProductVideo";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Rich } from "@/components/ui/Rich";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

// 720p muted loop (6.6 MB) for everyone; the 1080p cut with sound (19 MB)
// only on request. Re-encoded from the 60 MB 1080p master.
const HEADSET_VIDEO = {
  loop: "/media/neroes-headset-720.mp4",
  full: "/media/neroes-headset-1080.mp4",
  poster: "/media/neroes-headset-poster.webp",
} as const;

// The "believed / vision" register: italic in the brand gold, as in Pedro's
// design (8 Oct 2026) — on black only.
const BELIEVED = "italic text-brand-gold";

// Today → next → the frontier.
const STAGE_DOT = ["bg-white", "bg-brand-vivid", "bg-brand-gold"] as const;

// One statement per section, set large and tight — Light display type.
const STATEMENT = "font-exo text-5xl font-light leading-[1.05] tracking-[-0.04em] md:text-7xl lg:text-[5.5rem]";
// The two lines either side of the register shift, a step smaller.
const SHIFT = "font-exo text-4xl font-light leading-[1.05] tracking-[-0.035em] md:text-6xl";
// Body copy over the star field.
const LEAD = "text-lg font-light leading-relaxed text-white/75 md:text-xl";

/**
 * The Home, after Pedro's call of 8 Oct 2026: our Hero (the brain), then the
 * body of his design — dark, monumental figures, no waves — all over one
 * star field. The brain's points never go away: they sit fixed behind every
 * section (see Hero/BrainHero), so scrolling on is travelling through them.
 * The wrapper is the star field's scope: black, its own stacking context
 * (the field sits at -z-10 inside it) and clipped, so the fixed field never
 * shows over the footer. Content from docs/content-inventory.md and Pedro's
 * design; the founder section stays out (30 Sept 2026).
 */
export function HomeContent() {
  const { t } = useLanguage();
  const h = t.home;

  return (
    <div data-starfield-scope="" className="relative isolate bg-black text-white [clip-path:inset(0)]">
      <Hero />

      {/* The problem — "1 in 8" */}
      <section aria-labelledby="problem-heading" className="py-28 md:py-44">
        <div className="container mx-auto px-4 md:px-6">
          <Eyebrow tone="vivid" className="mb-8">
            {h.problem.eyebrow}
          </Eyebrow>
          <h2 id="problem-heading" className="max-w-5xl">
            <span className={cn(BIG_NUMBER, "pb-2 text-[clamp(6rem,24vw,17rem)]")}>{h.problem.value}</span>{" "}
            <span className="mt-6 block max-w-3xl font-exo text-2xl font-light leading-snug tracking-[-0.02em] text-white md:text-4xl">
              {h.problem.body}
            </span>
          </h2>
          <p className="mt-12 max-w-xl border-l-2 border-brand-vivid pl-5 text-lg font-light leading-relaxed text-white/80 md:text-xl">
            {h.problem.line}
          </p>
        </div>
      </section>

      {/* The platform, stated */}
      <section id="plataforma" aria-labelledby="platform-heading" className="scroll-mt-24 pb-16 pt-16 md:pb-24 md:pt-24">
        <div className="container mx-auto px-4 text-center md:px-6">
          <Eyebrow tone="vivid" className="mb-6">
            {h.platform.eyebrow}
          </Eyebrow>
          <FocusReveal>
            <h2 id="platform-heading" className={cn(STATEMENT, "mx-auto max-w-5xl")}>
              {h.platform.title}
            </h2>
          </FocusReveal>
          <p className={cn(LEAD, "mx-auto mt-8 max-w-2xl")}>
            <Rich text={h.platform.lead} tone="inverse" />
          </p>
        </div>
      </section>

      {/* The device itself, framed so its warm tones sit on black */}
      <ProductVideo
        framed
        src={HEADSET_VIDEO.loop}
        fullSrc={HEADSET_VIDEO.full}
        poster={HEADSET_VIDEO.poster}
        caption={h.platform.videoCaption}
        soundLabel={h.platform.videoPlayLabel}
        pauseLabel={h.platform.videoPause}
        resumeLabel={h.platform.videoResume}
        fallback={h.platform.videoFallback}
      />

      {/* The loop, and what it runs on */}
      <section aria-label={h.platform.techLabel} className="pb-24 pt-20 md:pb-32 md:pt-28">
        <div className="container mx-auto px-4 md:px-6">
          <ol className="grid gap-px overflow-hidden rounded-3xl border border-white/12 bg-white/12 md:grid-cols-3">
            {h.platform.steps.map((step) => (
              <li key={step.index} className="bg-black/70 p-8 backdrop-blur-[2px] md:p-10">
                <span className="text-sm font-bold text-brand-vivid">{step.index}</span>
                <h3 className="mt-3 text-3xl font-bold tracking-[-0.02em]">{step.title}</h3>
                <p className="mt-3 text-lg font-light leading-relaxed text-white/75">{step.desc}</p>
              </li>
            ))}
          </ol>

          <div className="mt-20 grid gap-12 border-t border-white/12 pt-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="text-2xl font-light leading-snug md:text-3xl">
                <Rich text={h.platform.networks} tone="inverse" />
              </p>
              <p className="mt-8 border-l-2 border-brand-vivid pl-5 leading-relaxed text-white/75">
                <Rich text={h.platform.beyond} tone="inverse" />
              </p>
            </div>
            <div className="lg:col-span-5">
              <Eyebrow tone="inverse">{h.platform.techLabel}</Eyebrow>
              <ul className="mt-4 divide-y divide-white/12 border-y border-white/12">
                {h.platform.tech.map((item) => (
                  <li key={item} className="py-3 text-lg">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-white/65">{h.platform.techNote}</p>
            </div>
          </div>
        </div>
      </section>

      {/* The evidence — monumental figures */}
      <Evidence />

      {/* Services: Corporate, Sport, Clinics, Education */}
      <section aria-labelledby="where-heading" className="py-24 md:py-36">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <Eyebrow tone="vivid" className="mb-6">
              {h.where.eyebrow}
            </Eyebrow>
            <FocusReveal>
              <h2 id="where-heading" className={STATEMENT}>
                {h.where.title}
              </h2>
            </FocusReveal>
          </div>
          <div className="mt-16 grid gap-12 sm:grid-cols-2 md:mt-24 md:gap-10 lg:grid-cols-4">
            {h.where.items.map((item) => (
              <div key={item.title} className="border-t border-white/40 pt-6">
                <h3 className="text-3xl font-bold tracking-[-0.02em]">{item.title}</h3>
                <p className="mt-3 text-lg font-light leading-relaxed text-white/75">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The journey, as one line with three stops */}
      <section aria-labelledby="journey-heading" className="py-24 md:py-36">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <Eyebrow tone="vivid" className="mb-6">
              {h.journey.eyebrow}
            </Eyebrow>
            <FocusReveal>
              <h2 id="journey-heading" className={STATEMENT}>
                {h.journey.title}
              </h2>
            </FocusReveal>
          </div>
          <ol className="relative mt-16 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-10">
            <span aria-hidden="true" className="absolute inset-x-0 top-[7px] hidden h-px bg-white/25 md:block" />
            {h.journey.stages.map((stage, i) => (
              <li key={stage.title} className="relative">
                <span aria-hidden="true" className={cn("block h-3.5 w-3.5 rounded-full ring-8 ring-black", STAGE_DOT[i])} />
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-white/65">{stage.label}</p>
                <h3 className={cn("mt-3 text-4xl font-light tracking-[-0.03em] md:text-5xl", i === 2 && BELIEVED)}>
                  {stage.title}
                </h3>
                <p className="mt-4 text-lg font-light leading-relaxed text-white/75">{stage.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Vision — measured above the line, believed below */}
      <section aria-labelledby="register-shift" className="pb-24 pt-28 md:pb-32 md:pt-40">
        <div className="container mx-auto px-4 md:px-6">
          {/* The register shift: everything above this line on the page is measured */}
          <div className="mx-auto max-w-5xl text-center">
            <FocusReveal>
              <p className={SHIFT}>{h.vision.measured}</p>
            </FocusReveal>
            <div className="my-10 flex items-center gap-5 md:my-12">
              <span aria-hidden="true" className="h-px flex-1 bg-white/25" />
              <span id="register-shift" className="text-xs font-bold uppercase tracking-[0.14em] text-white/65">
                {h.vision.shiftLabel}
              </span>
              <span aria-hidden="true" className="h-px flex-1 bg-white/25" />
            </div>
            <FocusReveal>
              <p className={cn(SHIFT, BELIEVED)}>{h.vision.believed}</p>
            </FocusReveal>
            <p className="mt-10 text-xs font-bold uppercase tracking-[0.14em] text-white/65">{h.vision.note}</p>
          </div>
        </div>
      </section>

      {/* What clients and athletes say */}
      <ClientTestimonials tone="dark" />

      {/* The north star, and what it opens up */}
      <section aria-labelledby="vision-heading" className="py-24 md:py-36">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <FocusReveal>
              <h2 id="vision-heading" className={STATEMENT}>
                {h.vision.title}
              </h2>
            </FocusReveal>
            <p className={cn(LEAD, "mx-auto mt-8 max-w-2xl")}>{h.vision.body}</p>
          </div>

          <div className="mt-24 grid gap-12 md:mt-32 md:grid-cols-3 md:gap-12">
            {h.vision.pillars.map((pillar) => (
              <div key={pillar.title}>
                <h3 className={cn("text-xl font-bold", BELIEVED)}>{pillar.title}</h3>
                <p className="mt-3 leading-relaxed text-white/75">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Neurorights */}
      <section aria-labelledby="neurorights-heading" className="py-24 md:py-36">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <Eyebrow tone="vivid" className="mb-6">
              {h.neurorights.eyebrow}
            </Eyebrow>
            <FocusReveal>
              <h2 id="neurorights-heading" className={STATEMENT}>
                {h.neurorights.title}
              </h2>
            </FocusReveal>
            <p className={cn(LEAD, "mx-auto mt-8 max-w-2xl")}>{h.neurorights.body}</p>
          </div>
          <ul className="mt-16 grid gap-4 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
            {h.neurorights.rights.map((right) => (
              <li key={right.code} className="rounded-2xl border border-white/12 bg-black/60 p-7 backdrop-blur-[2px]">
                <span className="text-xs font-bold tracking-[0.1em] text-brand-vivid">{right.code}</span>
                <h3 className="mt-3 text-xl font-bold tracking-[-0.01em]">{right.title}</h3>
                <p className="mt-2 leading-relaxed text-white/75">{right.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The companies that back us — at the bottom, as Pedro asked */}
      <section aria-labelledby="partners-home-heading" className="pb-8 pt-12 md:pb-12 md:pt-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="border-t border-white/12 pt-10 md:pt-12">
            <h2 id="partners-home-heading" className="text-center text-xs font-bold uppercase tracking-[0.14em] text-white/65">
              {t.shared.partnersHeading}
            </h2>
            <PartnerLogos spread tone="inverse" className="mt-10 md:mt-12" />
          </div>
        </div>
      </section>

      {/* Closing — one card, one action */}
      <section aria-labelledby="closing-heading" className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/15 bg-gradient-to-b from-white/[0.09] to-black/60 px-6 py-20 text-center backdrop-blur-[2px] md:py-32">
          <h2 id="closing-heading" className={cn(STATEMENT, "mx-auto max-w-4xl")}>
            {h.closing.ground} <span className="block italic text-brand-vivid">{h.closing.sky}</span>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-lg font-light leading-relaxed text-white/75 md:text-xl">{h.closing.body}</p>
          <div className="mt-10 flex justify-center">
            <Button asChild size="lg" variant="inverse">
              <Link href="/contact">{h.closing.primary}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
