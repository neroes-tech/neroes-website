"use client";

import { forwardRef } from "react";

import type { Day, Slot } from "@/lib/scheduling/availability";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

import { fill, formatDayLong } from "./format";

interface Props {
  day: Day | null;
  /** Shown above the list, e.g. "someone just booked that time". */
  notice: string | null;
  noneThisMonth: boolean;
  onPick: (slot: Slot) => void;
}

/**
 * The chosen day's times: free ones are buttons, booked ones stay in the list
 * marked "Ocupado" so the visitor sees the day's real state. Times that have
 * already passed (today) are left out.
 */
export const DayPanel = forwardRef<HTMLHeadingElement, Props>(function DayPanel({ day, notice, noneThisMonth, onPick }, ref) {
  const { t, locale } = useLanguage();
  const s = t.contact.scheduler;

  if (!day) {
    return (
      <div className="flex h-full min-h-48 items-center justify-center text-center">
        <p className="max-w-xs text-muted-foreground">{noneThisMonth ? s.noneThisMonth : s.pickDay}</p>
      </div>
    );
  }

  const slots = day.slots.filter((slot) => slot.status !== "past");
  const status =
    day.status === "available"
      ? `${day.freeCount === 1 ? s.freeOne : fill(s.freeMany, { n: day.freeCount })} · ${s.lisbonTime}`
      : day.status === "busy"
        ? s.dayBusy
        : (day.reason && s.closedReasons[day.reason]) || s.dayClosed;

  return (
    <div>
      <h3 ref={ref} tabIndex={-1} className="font-exo text-xl font-bold tracking-[-0.02em] text-foreground focus:outline-none">
        {formatDayLong(day.date, locale)}
      </h3>
      <p
        aria-live="polite"
        className={cn("mt-1 text-sm", day.status === "busy" ? "font-medium text-destructive" : "text-muted-foreground")}
      >
        {status}
      </p>

      {notice && (
        <p role="alert" className="mt-4 rounded-xl border border-destructive/30 bg-destructive/[0.06] px-4 py-3 text-sm text-destructive">
          {notice}
        </p>
      )}

      {slots.length > 0 && (
        <ul className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
          {slots.map((slot) => (
            <li key={slot.start}>
              {slot.status === "free" ? (
                <button
                  type="button"
                  onClick={() => onPick(slot)}
                  aria-label={`${slot.label}, ${s.slotFree}`}
                  className="flex h-12 w-full items-center justify-center rounded-xl border border-secondary/40 text-[0.95rem] font-bold tabular-nums text-secondary transition-colors hover:border-secondary hover:bg-secondary hover:text-secondary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {slot.label}
                </button>
              ) : (
                <div className="flex h-12 w-full flex-col items-center justify-center rounded-xl bg-muted leading-none text-muted-foreground">
                  <span className="sr-only">{`${slot.label}, ${s.slotBusy}`}</span>
                  <span aria-hidden="true" className="text-[0.95rem] tabular-nums line-through decoration-foreground/30">
                    {slot.label}
                  </span>
                  <span aria-hidden="true" className="mt-1 text-[10px] font-bold uppercase tracking-[0.08em]">
                    {s.slotBusy}
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
