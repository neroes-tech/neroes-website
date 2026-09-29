"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Rich } from "@/components/ui/Rich";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

/**
 * The published results, each with what it measures and how. One source
 * (t.shared.evidence) for the Home and the Science page, so a figure can
 * never read differently on two pages.
 */
export function Evidence({
  headingOverride,
  numbered = true,
  showScienceLink = false,
  className,
}: {
  /** Science page uses its own heading; the Home uses the evidence title. */
  headingOverride?: string;
  /** false drops the Home's section index ("03 — ") from the eyebrow. */
  numbered?: boolean;
  showScienceLink?: boolean;
  className?: string;
}) {
  const { t } = useLanguage();
  const ev = t.shared.evidence;

  return (
    <section
      id="evidencia"
      aria-labelledby="evidence-heading"
      className={cn("scroll-mt-24 border-t border-border bg-muted py-20 md:py-28", className)}
    >
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading
          id="evidence-heading"
          eyebrow={numbered ? ev.eyebrow : ev.eyebrow.replace(/^\d+\s*—\s*/, "")}
          title={headingOverride ?? ev.title}
        />

        {/* Lead result */}
        <div className="grid gap-6 border-t border-foreground/15 pt-8 lg:grid-cols-12 lg:gap-10">
          <p className="font-exo text-7xl font-bold leading-none tracking-tight text-secondary tabular-nums md:text-[7.5rem] lg:col-span-5">
            {ev.leadValue}
          </p>
          <div className="lg:col-span-7 lg:pt-3">
            <p className="text-2xl font-medium leading-snug text-foreground md:text-3xl">{ev.leadLabel}</p>
            <p className="mt-4 font-mono text-xs leading-relaxed tracking-[0.06em] text-muted-foreground">
              {ev.leadSource}
            </p>
          </div>
        </div>

        {/* Further studies */}
        <dl className="mt-12">
          {ev.studies.map((study) => (
            <div
              key={study.value}
              className="grid gap-2 border-t border-foreground/15 py-6 md:grid-cols-12 md:gap-8"
            >
              <dt className="font-exo text-4xl font-bold leading-none tabular-nums text-foreground md:col-span-3">
                {study.value}
              </dt>
              <dd className="text-lg leading-snug text-muted-foreground md:col-span-5">
                <Rich text={study.desc} />
              </dd>
              <dd className="font-mono text-xs uppercase leading-relaxed tracking-[0.08em] text-muted-foreground md:col-span-4 md:pt-1">
                {study.method}
              </dd>
            </div>
          ))}
        </dl>

        {/* How to read them */}
        <div className="grid gap-10 border-t border-foreground/15 pt-8 md:grid-cols-2 md:gap-12">
          <div>
            <h3>
              <Eyebrow as="span" tone="muted">
                {ev.honestTitle}
              </Eyebrow>
            </h3>
            <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
              <Rich text={ev.honestBody} />
            </p>
          </div>
          <div>
            <h3>
              <Eyebrow as="span">{ev.liveTitle}</Eyebrow>
            </h3>
            <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
              <Rich text={ev.liveBody} />
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4">
          <p className="text-lg font-medium text-foreground">{ev.ctaText}</p>
          <Button asChild variant="outline">
            <Link href="/contact">{ev.ctaButton}</Link>
          </Button>
          {showScienceLink && (
            <Link href="/science" className="font-medium text-secondary underline-offset-4 hover:underline">
              {ev.scienceLink} →
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
