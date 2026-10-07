"use client";

import { BookingScheduler } from "@/components/scheduling/BookingScheduler";
import { BookingEmbed } from "@/components/sections/BookingEmbed";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/ui/PageHero";
import { BOOKING, CONTACT_INFO } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

/**
 * Contacto = scheduling only (Pedro, 30 Sept 2026). In order of preference:
 * 1. the site's own agenda (src/components/scheduling) — free and fully
 *    booked days, the day's times, the booking — when bookings have
 *    somewhere to be saved (BOOKING_STORE, see src/lib/scheduling/store.ts);
 * 2. an embedded Google Calendar appointment schedule or Calendly event
 *    (NEXT_PUBLIC_BOOKING_URL, see constants.ts);
 * 3. email and phone, rather than an empty or dead calendar.
 */
export function ContactPageContent({ scheduler, emailConfirm }: { scheduler: boolean; emailConfirm: boolean }) {
  const { t } = useLanguage();
  const c = t.contact;
  const subtitle = scheduler
    ? emailConfirm
      ? c.subtitle
      : c.subtitleNoEmail
    : BOOKING
      ? c.subtitle
      : c.subtitleNoCalendar;

  return (
    <>
      <PageHero
        eyebrow={c.eyebrow}
        title={c.title}
        // The calendar subtitle promises a slot picker (and an email only when
        // one goes out); without a calendar, say what happens instead.
        subtitle={subtitle}
        size="compact"
        maxWidth="3xl"
      />

      <section className="bg-background pb-20 md:pb-28">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          {scheduler ? (
            <>
              <BookingScheduler />
              <p className="mt-5 text-center text-sm text-muted-foreground">
                {c.scheduler.fallbackPrefix}{" "}
                <a href={`mailto:${CONTACT_INFO.email}`} className="font-medium text-secondary underline-offset-4 hover:underline">
                  {CONTACT_INFO.email}
                </a>{" "}
                · {c.phoneLabel}{" "}
                <a href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, "")}`} className="font-medium text-secondary underline-offset-4 hover:underline">
                  {CONTACT_INFO.phone}
                </a>
              </p>
            </>
          ) : BOOKING ? (
            <>
              <BookingEmbed booking={BOOKING} title={c.calendarTitle} />
              <p className="mt-5 text-center text-sm text-muted-foreground">
                {c.calendarFallbackPrefix}{" "}
                <a
                  href={BOOKING.url}
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
