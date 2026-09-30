"use client";

import Image from "next/image";
import Link from "next/link";

import { Hero } from "@/components/home/Hero";
import { PartnerLogos } from "@/components/layout/PartnerLogos";
import { BlurReveal } from "@/components/motion/BlurReveal";
import { Marquee } from "@/components/motion/Marquee";
import { WordReveal } from "@/components/motion/WordReveal";
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

// Stills from the headset film, in the order of the gallery (alt texts in t.home.media.galleryAlts).
const GALLERY = ["0_5", "4", "8", "12", "16", "20", "24", "28"].map((t) => `/media/gallery/headset-${t}.webp`);

// The "believed / vision" register: italic in the logo's vivid blue on
// black (7.4:1) and the brand blue on white (5.1:1). No gold.
const VISION_ON_BLACK = "italic text-[#00A5E9]";
const VISION_ON_WHITE = "italic text-secondary";

// Today → next → the frontier.
const STAGE_DOT = ["bg-foreground", "bg-secondary", "bg-accent"] as const;

// One statement per section, set large and tight.
const STATEMENT = "font-exo text-5xl font-medium leading-[0.95] tracking-[-0.04em] md:text-7xl lg:text-[5.5rem]";

/** A full-height photo card with its statement laid over the lower part. */
function ImageCard({
  src,
  alt,
  title,
  body,
  imageClassName,
}: {
  src: string;
  alt: string;
  title: string;
  body?: string;
  /** e.g. mix-blend-screen for a render on black, so it sits on the card surface. */
  imageClassName?: string;
}) {
  return (
    <figure className="relative isolate flex min-h-[480px] flex-col justify-end overflow-hidden rounded-3xl bg-[#101010] p-7 ring-1 ring-inset ring-white/10 md:min-h-[640px] md:p-10">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className={cn("-z-10 object-cover", imageClassName)}
      />
      {/* Legibility: the lower half darkens under the text. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
      <figcaption>
        <h3 className="font-exo text-4xl font-medium leading-[0.98] tracking-[-0.04em] text-white md:text-6xl">{title}</h3>
        {body && (
          <p className="mt-6 max-w-lg rounded-2xl bg-black/50 p-5 text-base font-light leading-relaxed text-white/90 backdrop-blur-md md:text-lg">
            {body}
          </p>
        )}
      </figcaption>
    </figure>
  );
}

/**
 * The Home, laid out after the Neurable company page the team picked as the
 * reference, with the content of Pedro's prototype (docs/content-inventory.md,
 * section 6) and the headset film. Black and white chapters alternate; every
 * statement is one large, tightly set line that comes into focus on scroll.
 */
export function HomeContent() {
  const { t } = useLanguage();
  const h = t.home;
  const media = h.media;

  return (
    <>
      <Hero />

      {/* 02 — The platform, stated; then who backs it */}
      <section
        id="plataforma"
        aria-labelledby="platform-heading"
        className="scroll-mt-24 bg-background pb-20 pt-28 md:pb-28 md:pt-40"
      >
        <div className="container mx-auto px-4 text-center md:px-6">
          <Eyebrow className="mb-6">{h.platform.eyebrow}</Eyebrow>
          <BlurReveal>
            <h2 id="platform-heading" className={cn(STATEMENT, "mx-auto max-w-5xl text-foreground")}>
              {h.platform.title}
            </h2>
          </BlurReveal>
          <p className="mx-auto mt-8 max-w-2xl text-lg font-light leading-relaxed text-muted-foreground md:text-xl">
            <Rich text={h.platform.lead} />
          </p>

          <p className="mt-20 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground md:mt-24">
            {t.shared.partnersHeading}
          </p>
          <PartnerLogos className="mt-8" />
        </div>
      </section>

      {/* The device itself, edge to edge */}
      <div className="bg-background">
        <ProductVideo
          src={HEADSET_VIDEO.loop}
          fullSrc={HEADSET_VIDEO.full}
          poster={HEADSET_VIDEO.poster}
          caption={h.platform.videoCaption}
          soundLabel={h.platform.videoPlayLabel}
          pauseLabel={h.platform.videoPause}
          resumeLabel={h.platform.videoResume}
          fallback={h.platform.videoFallback}
        />
      </div>

      {/* The loop, and what it runs on */}
      <section aria-label={h.platform.techLabel} className="bg-background pb-24 pt-16 md:pb-32 md:pt-24">
        <div className="container mx-auto px-4 md:px-6">
          <ol className="grid gap-10 md:grid-cols-3 md:gap-12">
            {h.platform.steps.map((step) => (
              <li key={step.index}>
                <span className="text-sm font-bold text-secondary">{step.index}</span>
                <h3 className="mt-3 text-3xl font-medium tracking-[-0.03em] text-foreground">{step.title}</h3>
                <p className="mt-3 text-lg font-light leading-relaxed text-muted-foreground">{step.desc}</p>
              </li>
            ))}
          </ol>

          <div className="mt-20 grid gap-12 border-t border-border pt-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="text-2xl font-light leading-snug text-foreground md:text-3xl">
                <Rich text={h.platform.networks} />
              </p>
              <p className="mt-8 border-l-2 border-secondary pl-5 leading-relaxed text-muted-foreground">
                <Rich text={h.platform.beyond} />
              </p>
            </div>
            <div className="lg:col-span-5">
              <Eyebrow tone="muted">{h.platform.techLabel}</Eyebrow>
              <ul className="mt-4 divide-y divide-border border-y border-border">
                {h.platform.tech.map((item) => (
                  <li key={item} className="py-3 text-lg text-foreground">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">{h.platform.techNote}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — The evidence, on black */}
      <Evidence />

      {/* 04 — Where it works today */}
      <section aria-labelledby="where-heading" className="bg-background py-24 md:py-36">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <Eyebrow className="mb-6">{h.where.eyebrow}</Eyebrow>
            <BlurReveal>
              <h2 id="where-heading" className={cn(STATEMENT, "text-foreground")}>
                {h.where.title}
              </h2>
            </BlurReveal>
          </div>
          <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-12">
            {h.where.items.map((item) => (
              <div key={item.title} className="border-t border-foreground pt-6">
                <h3 className="text-3xl font-medium tracking-[-0.03em] text-foreground">{item.title}</h3>
                <p className="mt-3 text-lg font-light leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05 — The journey, as one line with three stops */}
      <section aria-labelledby="journey-heading" className="bg-muted py-24 md:py-36">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <Eyebrow className="mb-6">{h.journey.eyebrow}</Eyebrow>
            <BlurReveal>
              <h2 id="journey-heading" className={cn(STATEMENT, "text-foreground")}>
                {h.journey.title}
              </h2>
            </BlurReveal>
          </div>
          <ol className="relative mt-16 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-10">
            <span aria-hidden="true" className="absolute inset-x-0 top-[7px] hidden h-px bg-foreground/20 md:block" />
            {h.journey.stages.map((stage, i) => (
              <li key={stage.title} className="relative">
                <span aria-hidden="true" className={cn("block h-3.5 w-3.5 rounded-full ring-8 ring-muted", STAGE_DOT[i])} />
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">{stage.label}</p>
                <h3
                  className={cn(
                    "mt-3 text-4xl font-medium tracking-[-0.03em] text-foreground md:text-5xl",
                    i === 2 && VISION_ON_WHITE,
                  )}
                >
                  {stage.title}
                </h3>
                <p className="mt-4 text-lg font-light leading-relaxed text-muted-foreground">{stage.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Vision — measured above the line, believed below; one black chapter */}
      <section aria-labelledby="vision-heading" className="bg-black pb-24 pt-24 text-white md:pb-36 md:pt-32">
        <div className="container mx-auto px-4 md:px-6">
          <h2 id="vision-heading" className="text-center text-xs font-bold uppercase tracking-[0.14em] text-white/55">
            {h.vision.shiftLabel} · {h.vision.note}
          </h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <ImageCard src="/media/vision-headset.webp" alt={media.measuredAlt} title={h.vision.measured} />
            <ImageCard
              src="/media/vision-brain.webp"
              alt={media.believedAlt}
              title={h.vision.believed}
              body={h.vision.body}
              imageClassName="object-[center_25%] mix-blend-screen"
            />
          </div>

          {/* The honest bridge, read word by word */}
          <figure className="mx-auto mt-28 max-w-5xl md:mt-40">
            <blockquote>
              <WordReveal
                text={`“${h.vision.quote}”`}
                className="font-exo text-3xl font-light leading-[1.2] tracking-[-0.02em] md:text-5xl"
              />
            </blockquote>
            <figcaption className="mt-8 text-sm text-white/55">— {h.vision.quoteCaption}</figcaption>
          </figure>
        </div>

        {/* The headset, piece by piece */}
        <div className="mt-24 md:mt-32" role="group" aria-label={media.galleryLabel}>
          <Marquee
            pauseLabel={media.galleryPause}
            playLabel={media.galleryPlay}
            items={GALLERY.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt={media.galleryAlts[i]!}
                width={450}
                height={300}
                className="h-[220px] w-auto rounded-2xl object-cover md:h-[300px]"
              />
            ))}
          />
        </div>

        <div className="container mx-auto mt-28 px-4 md:mt-40 md:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <BlurReveal>
              <h3 className={STATEMENT}>{h.vision.title}</h3>
            </BlurReveal>
          </div>
          <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-12">
            {h.vision.pillars.map((pillar) => (
              <div key={pillar.title}>
                <h4 className={cn("text-xl font-bold", VISION_ON_BLACK)}>{pillar.title}</h4>
                <p className="mt-3 leading-relaxed text-white/65">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 06 — Founder */}
      <section aria-labelledby="founders-heading" className="bg-background py-24 md:py-36">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <Eyebrow className="mb-6">{h.founders.eyebrow}</Eyebrow>
            <BlurReveal>
              <h2 id="founders-heading" className={cn(STATEMENT, "text-foreground")}>
                {h.founders.title}
              </h2>
            </BlurReveal>
          </div>
          <article className="mx-auto mt-16 max-w-2xl text-center md:mt-20">
            <h3 className="text-2xl font-medium tracking-[-0.02em] text-foreground">Pedro Pestana</h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-secondary">{h.founders.pedroRole}</p>
            <p className="mt-6 text-lg font-light leading-relaxed text-muted-foreground">
              <Rich text={h.founders.pedroMission} />
            </p>
            <p className="mt-4 text-lg font-light leading-relaxed text-muted-foreground">
              <Rich text={h.founders.pedroPersonal} />
            </p>
          </article>
        </div>
      </section>

      {/* 07 — Neurorights */}
      <section aria-labelledby="neurorights-heading" className="bg-muted py-24 md:py-36">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <Eyebrow className="mb-6">{h.neurorights.eyebrow}</Eyebrow>
            <BlurReveal>
              <h2 id="neurorights-heading" className={cn(STATEMENT, "text-foreground")}>
                {h.neurorights.title}
              </h2>
            </BlurReveal>
            <p className="mx-auto mt-8 max-w-2xl text-lg font-light leading-relaxed text-muted-foreground md:text-xl">
              {h.neurorights.body}
            </p>
          </div>
          <ul className="mt-16 grid gap-4 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
            {h.neurorights.rights.map((right) => (
              <li key={right.code} className="rounded-2xl bg-background p-7">
                <span className="text-xs font-bold tracking-[0.1em] text-secondary">{right.code}</span>
                <h3 className="mt-3 text-xl font-medium tracking-[-0.02em] text-foreground">{right.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{right.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Closing — one card, one action */}
      <section aria-labelledby="closing-heading" className="bg-black px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/15 bg-gradient-to-b from-white/[0.09] to-white/[0.01] px-6 py-20 text-center text-white md:py-32">
          <h2 id="closing-heading" className={cn(STATEMENT, "mx-auto max-w-4xl")}>
            {h.closing.ground}{" "}
            <span className={cn("block", VISION_ON_BLACK)}>{h.closing.sky}</span>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-lg font-light leading-relaxed text-white/70 md:text-xl">{h.closing.body}</p>
          <div className="mt-10 flex justify-center">
            <Button asChild size="lg" variant="inverse">
              <Link href="/contact">{h.closing.primary}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
