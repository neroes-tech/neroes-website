"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import type { Slot } from "@/lib/scheduling/availability";
import { CONTACT_INFO } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

import { BookingDone } from "./BookingDone";
import { BookingForm, EMPTY_FIELDS, type BookedResult, type BookingFields } from "./BookingForm";
import { DayPanel } from "./DayPanel";
import { lisbonMonth, shiftMonth, type AvailabilityResponse } from "./format";
import { MonthCalendar } from "./MonthCalendar";

type Load = { status: "loading" } | { status: "error" } | { status: "ready"; data: AvailabilityResponse };

/**
 * The Contacto page's booking calendar: a month view with the free, fully
 * booked and closed days, the chosen day's times (free ones bookable, taken
 * ones shown as "Ocupado"), then the visitor's details and a confirmation.
 * Availability comes from GET /api/availability; bookings go to
 * POST /api/bookings, which re-checks everything server-side.
 */
export function BookingScheduler({ demo = false }: { demo?: boolean }) {
  const { t } = useLanguage();
  const s = t.contact.scheduler;

  const [month, setMonth] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  const [load, setLoad] = useState<Load>({ status: "loading" });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [fields, setFields] = useState<BookingFields>(EMPTY_FIELDS);
  const [done, setDone] = useState<BookedResult | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [visitorTimeZone, setVisitorTimeZone] = useState<string | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  // Move focus to the panel's heading after a step change (not on first load).
  const focusPanel = useRef(false);

  // After mount (the server can't know them): the current month in Lisbon, so
  // the first request already asks for it, and the visitor's own time zone.
  useEffect(() => {
    setMonth(lisbonMonth());
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setVisitorTimeZone(tz && tz !== "Europe/Lisbon" ? tz : null);
    } catch {
      setVisitorTimeZone(null);
    }
  }, []);

  useEffect(() => {
    if (!month) return;
    const controller = new AbortController();
    setLoad((prev) => (prev.status === "ready" && prev.data.month === month ? prev : { status: "loading" }));
    fetch(`/api/availability?month=${month}`, { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        const body = (await response.json().catch(() => null)) as (AvailabilityResponse & { minMonth?: string }) | null;
        // A device clock in another month than Lisbon: start where the server says.
        if (response.status === 400 && body?.minMonth && body.minMonth !== month) {
          setMonth(body.minMonth);
          return;
        }
        if (!response.ok || !body) throw new Error(String(response.status));
        setLoad({ status: "ready", data: body });
        // Keep the chosen day if it is still in view; otherwise open the
        // first day with free times, so the list shows straight away.
        setSelectedDate((current) => {
          if (current && body.days.some((d) => d.date === current && d.status !== "closed")) return current;
          return body.days.find((d) => d.status === "available")?.date ?? null;
        });
      })
      .catch((error: unknown) => {
        if ((error as Error).name === "AbortError") return;
        // A failed refresh keeps what is on screen (a confirmation included).
        setLoad((prev) => (prev.status === "ready" && prev.data.month === month ? prev : { status: "error" }));
      });
    return () => controller.abort();
  }, [month, reload]);

  useEffect(() => {
    if (!focusPanel.current) return;
    focusPanel.current = false;
    headingRef.current?.focus();
    // On phones the panel sits below the calendar.
    if (window.matchMedia("(max-width: 1023px)").matches) {
      panelRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, [slot, done, selectedDate]);

  const data = load.status === "ready" ? load.data : null;
  const day = data?.days.find((d) => d.date === selectedDate) ?? null;

  const step = useCallback((update: () => void) => {
    focusPanel.current = true;
    update();
  }, []);

  if (load.status === "error") {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center md:p-12">
        <p role="alert" className="text-lg text-foreground">
          {s.loadError}
        </p>
        <Button className="mt-5" variant="outline" onClick={() => setReload((n) => n + 1)}>
          {s.retry}
        </Button>
        <p className="mt-5 text-sm text-muted-foreground">
          {s.fallbackPrefix}{" "}
          <a href={`mailto:${CONTACT_INFO.email}`} className="font-medium text-secondary underline underline-offset-2">
            {CONTACT_INFO.email}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <section aria-labelledby="scheduler-heading" className="overflow-hidden rounded-3xl border border-border bg-card">
      <h2 id="scheduler-heading" className="sr-only">
        {s.heading}
      </h2>
      {demo && (
        <p className="border-b border-border bg-muted px-5 py-3 text-sm font-medium text-foreground sm:px-8">
          {s.demoNotice}
        </p>
      )}
      {load.status === "loading" && (
        <p role="status" className="sr-only">
          {s.loading}
        </p>
      )}
      <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="p-5 sm:p-8">
          {/* Until the month in Lisbon is known (after mount), a placeholder. */}
          {!month ? (
            <div aria-hidden="true" className="space-y-3">
              <div className="h-7 w-40 animate-pulse rounded-lg bg-muted" />
              <div className="grid grid-cols-7 gap-1.5 pt-6">
                {Array.from({ length: 35 }, (_, i) => (
                  <div key={i} className="h-11 animate-pulse rounded-xl bg-muted sm:h-14" />
                ))}
              </div>
            </div>
          ) : (
            <MonthCalendar
              month={month}
              days={data && data.month === month ? data.days : null}
              today={data?.today ?? null}
              selectedDate={selectedDate}
              canPrev={Boolean(data && month > data.minMonth)}
              canNext={Boolean(data && month < data.maxMonth)}
              onMonthChange={(delta) => {
                // Changing month keeps focus on the arrow the visitor pressed.
                focusPanel.current = false;
                setNotice(null);
                setSlot(null);
                setMonth(shiftMonth(month, delta));
              }}
              onSelect={(date) => {
                // The day already open: nothing changes, so nothing to move focus for.
                if (date === selectedDate && !slot && !done) return;
                step(() => {
                  setNotice(null);
                  setSlot(null);
                  setDone(null);
                  setSelectedDate(date);
                });
              }}
            />
          )}
        </div>

        <div ref={panelRef} className="scroll-mt-28 border-t border-border p-5 sm:p-8 lg:border-l lg:border-t-0">
          {done && data ? (
            <BookingDone
              ref={headingRef}
              demo={demo}
              result={done}
              timeZone={data.timeZone}
              visitorTimeZone={visitorTimeZone}
              onAnother={() =>
                step(() => {
                  setDone(null);
                  setSlot(null);
                })
              }
            />
          ) : slot && selectedDate && data ? (
            <BookingForm
              ref={headingRef}
              slot={slot}
              date={selectedDate}
              timeZone={data.timeZone}
              visitorTimeZone={visitorTimeZone}
              fields={fields}
              onFieldsChange={setFields}
              onBack={() => step(() => setSlot(null))}
              onBooked={(result) =>
                step(() => {
                  setDone(result);
                  // Keep the contact details for another booking; the rest is per booking.
                  setFields((prev) => ({ ...prev, message: "", consent: false, website: "" }));
                  // The booked time now shows as taken.
                  setReload((n) => n + 1);
                })
              }
              onSlotLost={(reason) =>
                step(() => {
                  setSlot(null);
                  setNotice(reason === "taken" ? s.errors.taken : s.errors.unavailable);
                  setReload((n) => n + 1);
                })
              }
            />
          ) : (
            <DayPanel
              ref={headingRef}
              day={day}
              notice={notice}
              noneThisMonth={Boolean(data && !data.days.some((d) => d.status === "available"))}
              onPick={(picked) =>
                step(() => {
                  setNotice(null);
                  setSlot(picked);
                })
              }
            />
          )}
        </div>
      </div>
    </section>
  );
}
