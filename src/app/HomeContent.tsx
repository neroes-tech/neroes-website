"use client";

import Link from "next/link";

import { Hero } from "@/components/home/Hero";
import { Evidence } from "@/components/sections/Evidence";
import { ProductVideo } from "@/components/sections/ProductVideo";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Rich } from "@/components/ui/Rich";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

// 720p muted loop (6.6 MB) for everyone; the 1080p cut with sound (19 MB)
// only on request. Re-encoded from the 60 MB 1080p master.
const HEADSET_VIDEO = {
  loop: "/media/neroes-headset-720.mp4",
  full: "/media/neroes-headset-1080.mp4",
  poster: "/media/neroes-headset-poster.webp",
} as const;

// The "believed / vision" register: italic in the brand blue (5.1:1 on
// paper). No gold — it stays in the logo artwork only.
const VISION_TEXT = "text-secondary";

// Today → next → the frontier: ink, brand blue, the logo's vivid blue.
const STAGE_DOT = ["bg-foreground", "bg-secondary", "bg-accent"] as const;

/** Standard section shell: 1px top rule, generous vertical rhythm. */
function Section({
  id,
  labelledBy,
  tone = "paper",
  className,
  children,
}: {
  id?: string;
  labelledBy: string;
  tone?: "paper" | "muted";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "scroll-mt-24 border-t border-border py-20 md:py-28",
        tone === "muted" ? "bg-muted" : "bg-background",
        className,
      )}
    >
      <div className="container mx-auto px-4 md:px-6">{children}</div>
    </section>
  );
}

/**
 * The Home carries the content of Pedro's prototype (docs/content-inventory.md,
 * section 6) — platform, evidence, where it works, journey, vision, founder,
 * neurorights, closing — plus the headset film. Nothing else.
 */
export function HomeContent() {
  const { t } = useLanguage();
  const h = t.home;

  return (
    <>
      <Hero />

      {/* 02 — The platform: the device edge to edge, then the sense → train → measure loop */}
      <section
        id="plataforma"
        aria-labelledby="platform-heading"
        className="scroll-mt-24 border-t border-border bg-background pt-20 md:pt-28"
      >
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            id="platform-heading"
            eyebrow={h.platform.eyebrow}
            title={h.platform.title}
            intro={<Rich text={h.platform.lead} />}
          />
        </div>

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

        <div className="container mx-auto px-4 pb-20 pt-16 md:px-6 md:pb-28 md:pt-20">
          <ol className="grid border-y border-border md:grid-cols-3 md:divide-x md:divide-border">
            {h.platform.steps.map((step) => (
              <li key={step.index} className="border-b border-border py-7 last:border-b-0 md:border-b-0 md:px-7 md:first:pl-0">
                <span className="font-mono text-sm text-secondary">{step.index}</span>
                <h3 className="mt-2 text-2xl font-bold text-foreground">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{step.desc}</p>
              </li>
            ))}
          </ol>

          <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <p className="text-xl leading-relaxed text-muted-foreground">
                <Rich text={h.platform.networks} />
              </p>
              <div className="mt-8 border-l-2 border-secondary pl-5">
                <p className="leading-relaxed text-muted-foreground">
                  <Rich text={h.platform.beyond} />
                </p>
              </div>
            </div>
            <div className="lg:col-span-5">
              <Eyebrow tone="muted">{h.platform.techLabel}</Eyebrow>
              <ul className="mt-4 divide-y divide-border border-y border-border">
                {h.platform.tech.map((item) => (
                  <li key={item} className="py-2.5 text-foreground">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-muted-foreground">{h.platform.techNote}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — The evidence (shared with the Science page) */}
      <Evidence />

      {/* 04 — Where it works today */}
      <Section labelledBy="where-heading">
        <SectionHeading id="where-heading" eyebrow={h.where.eyebrow} title={h.where.title} />
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {h.where.items.map((item) => (
            <div key={item.title} className="border-t-2 border-foreground pt-5">
              <h3 className="text-3xl font-bold text-foreground">{item.title}</h3>
              <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 05 — The journey */}
      <Section labelledBy="journey-heading">
        <SectionHeading id="journey-heading" eyebrow={h.journey.eyebrow} title={h.journey.title} />
        <ol>
          {h.journey.stages.map((stage, i) => (
            <li
              key={stage.title}
              className="grid gap-3 border-t border-border py-7 md:grid-cols-12 md:items-baseline md:gap-8"
            >
              {/* Block text (not flex) so its baseline lines up with the stage title's. */}
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground md:col-span-3">
                <span
                  aria-hidden="true"
                  className={cn("mr-2.5 inline-block h-2 w-2 -translate-y-px rounded-full align-middle", STAGE_DOT[i])}
                />
                {stage.label}
              </p>
              <h3 className={cn("text-4xl font-bold text-foreground md:col-span-4", i === 2 && cn("italic", VISION_TEXT))}>
                {stage.title}
              </h3>
              <p className="text-lg leading-relaxed text-muted-foreground md:col-span-5">{stage.desc}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Register shift — measured above, believed below; then the vision. Centred, as one statement. */}
      <Section labelledBy="vision-heading" tone="muted">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-3xl font-bold leading-tight text-foreground md:text-5xl">{h.vision.measured}</p>
          <div className="my-6 flex items-center gap-4" aria-hidden="true">
            <span className="h-px flex-1 bg-foreground/30" />
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">{h.vision.shiftLabel}</span>
            <span className="h-px flex-1 bg-foreground/30" />
          </div>
          <p className={cn("text-3xl font-bold italic leading-tight md:text-5xl", VISION_TEXT)}>{h.vision.believed}</p>
          <Eyebrow tone="muted" className="mt-6">
            {h.vision.note}
          </Eyebrow>
        </div>

        <div className="mx-auto mt-20 max-w-3xl text-center">
          <h2 id="vision-heading" className="text-3xl font-bold leading-[1.1] tracking-tight text-foreground md:text-[2.75rem]">
            {h.vision.title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{h.vision.body}</p>
          <figure className="mt-12">
            <blockquote className={cn("text-2xl italic leading-snug md:text-[1.75rem]", VISION_TEXT)}>
              “{h.vision.quote}”
            </blockquote>
            <figcaption className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {h.vision.quoteCaption}
            </figcaption>
          </figure>
        </div>

        <div className="mt-16 grid gap-10 text-center md:grid-cols-3 md:gap-8">
          {h.vision.pillars.map((pillar) => (
            <div key={pillar.title} className="border-t border-foreground/15 pt-5">
              <h3 className={cn("text-xl font-bold italic", VISION_TEXT)}>{pillar.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 06 — Founder */}
      <Section labelledBy="founders-heading">
        <SectionHeading id="founders-heading" eyebrow={h.founders.eyebrow} title={h.founders.title} />
        <article className="max-w-3xl border-t-2 border-foreground pt-6">
          <h3 className="text-2xl font-bold text-foreground">Pedro Pestana</h3>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-secondary">{h.founders.pedroRole}</p>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            <Rich text={h.founders.pedroMission} />
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            <Rich text={h.founders.pedroPersonal} />
          </p>
        </article>
      </Section>

      {/* 07 — Neurorights */}
      <Section labelledBy="neurorights-heading">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <SectionHeading
            id="neurorights-heading"
            eyebrow={h.neurorights.eyebrow}
            title={h.neurorights.title}
            className="mb-0 lg:col-span-6"
          />
          <p className="text-lg leading-relaxed text-muted-foreground lg:col-span-6 lg:pt-10">{h.neurorights.body}</p>
        </div>
        <ul className="mt-12 grid border-t border-border sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-border">
          {h.neurorights.rights.map((right) => (
            <li key={right.code} className="border-b border-border py-6 lg:border-b-0 lg:px-6 lg:first:pl-0">
              <span className="font-mono text-xs text-secondary">{right.code}</span>
              <h3 className="mt-2 text-xl font-bold text-foreground">{right.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{right.desc}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Closing — centred, one action */}
      <Section labelledBy="closing-heading">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="closing-heading" className="text-4xl font-bold leading-[1.05] tracking-tight text-foreground md:text-6xl">
            {h.closing.ground}{" "}
            <span className={cn("block italic", VISION_TEXT)}>{h.closing.sky}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-muted-foreground">{h.closing.body}</p>
          <div className="mt-10 flex justify-center">
            <Button asChild size="lg">
              <Link href="/contact">{h.closing.primary}</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
