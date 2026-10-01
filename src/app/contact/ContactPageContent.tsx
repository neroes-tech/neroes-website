"use client";

import { CalendlyEmbed } from "@/components/sections/CalendlyEmbed";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/ui/PageHero";
import { CALENDLY_URL, CONTACT_INFO } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

/**
 * Contacto = scheduling only (Pedro, 30 Sept 2026): the visitor picks a slot
 * in Calendly and that's it — no form. Until a booking link is configured
 * (NEXT_PUBLIC_CALENDLY_URL, see constants.ts), the page offers email and
 * phone instead of an empty or dead calendar.
 */
export function ContactPageContent() {
  const { t } = useLanguage();
  const c = t.contact;

  return (
    <>
      <PageHero
        eyebrow={c.eyebrow}
        title={c.title}
        // The calendar subtitle promises a slot picker; without one, say what happens instead.
        subtitle={CALENDLY_URL ? c.subtitle : c.subtitleNoCalendar}
        size="compact"
        maxWidth="3xl"
      />

      <section className="bg-background pb-20 md:pb-28">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          {CALENDLY_URL ? (
            <>
              <CalendlyEmbed url={CALENDLY_URL} title={c.calendarTitle} />
              <p className="mt-5 text-center text-sm text-muted-foreground">
                {c.calendarFallbackPrefix}{" "}
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-secondary underline-offset-4 hover:underline"
                >
                  {c.calendarFallbackLink}
                </a>
              </p>
            </>
          ) : (
            <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8 text-center md:p-12">
              <h2 className="font-exo text-3xl font-light tracking-[-0.03em] text-foreground md:text-4xl">
                {c.noCalendarTitle}
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-lg font-light leading-relaxed text-muted-foreground">
                {c.noCalendarBody}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button asChild size="lg">
                  <a href={`mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(c.noCalendarSubject)}`}>
                    {c.noCalendarEmailButton}
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, "")}`}>
                    {c.phoneLabel}: {CONTACT_INFO.phone}
                  </a>
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                <a href={`mailto:${CONTACT_INFO.email}`} className="underline-offset-4 hover:underline">
                  {CONTACT_INFO.email}
                </a>
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
