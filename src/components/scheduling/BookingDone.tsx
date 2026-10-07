"use client";

import { forwardRef, useEffect, useMemo, useState } from "react";
import { CalendarPlus, CheckCircle2, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CONTACT_INFO } from "@/lib/constants";
import { buildIcs, googleCalendarUrl } from "@/lib/scheduling/ics";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

import type { BookedResult } from "./BookingForm";
import { fill, formatDayLong, formatTime, formatVisitorTime } from "./format";

interface Props {
  result: BookedResult;
  timeZone: string;
  visitorTimeZone: string | null;
  onAnother: () => void;
}

/** Confirmation, with the event ready for the visitor's own calendar. */
export const BookingDone = forwardRef<HTMLHeadingElement, Props>(function BookingDone(
  { result, timeZone, visitorTimeZone, onAnother },
  headingRef,
) {
  const { t, locale } = useLanguage();
  const d = t.contact.scheduler.done;
  const s = t.contact.scheduler;

  const event = useMemo(
    () => ({
      start: new Date(result.start),
      end: new Date(result.end),
      title: d.eventTitle,
      description: `${d.eventDescription} ${CONTACT_INFO.email} · ${CONTACT_INFO.phone}`,
    }),
    [result.start, result.end, d.eventTitle, d.eventDescription],
  );

  // The .ics as a downloadable file, released when this view goes away.
  const [icsUrl, setIcsUrl] = useState<string | null>(null);
  useEffect(() => {
    const ics = buildIcs({
      ...event,
      // Same UID as the emailed invite, so adding both doesn't duplicate the event.
      uid: `${result.id}@neroes.tech`,
      organizerEmail: CONTACT_INFO.email,
      attendee: { name: result.name, email: result.email },
    });
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    setIcsUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [event, result.id, result.email, result.name]);

  return (
    <div>
      <CheckCircle2 className="h-9 w-9 text-secondary" aria-hidden="true" />
      <h3 ref={headingRef} tabIndex={-1} className="mt-4 font-exo text-2xl font-bold tracking-[-0.02em] text-foreground focus:outline-none">
        {d.title}
      </h3>
      <p className="mt-2 text-lg font-light text-foreground">
        {formatDayLong(result.date, locale)}, {formatTime(result.start, timeZone, locale)}–{formatTime(result.end, timeZone, locale)}
        <span className="text-muted-foreground"> · {s.lisbonTime}</span>
      </p>
      {visitorTimeZone && (
        <p className="mt-1 text-sm text-muted-foreground">
          {fill(s.yourTime, { time: formatVisitorTime(result.start, visitorTimeZone, result.date, locale) })}
        </p>
      )}
      <p className="mt-4 text-muted-foreground">{result.emailSent ? fill(d.emailSent, { email: result.email }) : d.saved}</p>

      <div className="mt-7 flex flex-wrap gap-3">
        <Button asChild>
          <a href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer">
            <CalendarPlus className="h-4 w-4" aria-hidden="true" />
            {d.addGoogle}
          </a>
        </Button>
        {icsUrl && (
          <Button asChild variant="outline">
            <a href={icsUrl} download="neroes.ics">
              <Download className="h-4 w-4" aria-hidden="true" />
              {d.downloadIcs}
            </a>
          </Button>
        )}
      </div>

      <button
        type="button"
        onClick={onAnother}
        className="mt-4 inline-flex h-10 items-center text-sm font-medium text-secondary underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
      >
        {d.another}
      </button>
    </div>
  );
});
