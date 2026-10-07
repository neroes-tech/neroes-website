"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { addDays, isoWeekday, monthRange, type Day } from "@/lib/scheduling/availability";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

import { fill, formatDayLong, formatMonth } from "./format";

interface Props {
  month: string;
  days: Day[] | null;
  today: string | null;
  selectedDate: string | null;
  canPrev: boolean;
  canNext: boolean;
  onMonthChange: (delta: -1 | 1) => void;
  onSelect: (date: string) => void;
}

/**
 * Month grid in the date-picker pattern (WAI-ARIA APG): one tab stop, arrow
 * keys move between days, Home/End to the start/end of the week. Every day is
 * focusable so keyboard users can read the closed ones too; only days with
 * times (free or fully booked) can be chosen. A fully booked day stays
 * selectable: its list then shows every time as taken.
 */
export function MonthCalendar({ month, days, today, selectedDate, canPrev, canNext, onMonthChange, onSelect }: Props) {
  const { t, locale } = useLanguage();
  const s = t.contact.scheduler;
  const headingId = useId();
  const gridRef = useRef<HTMLDivElement>(null);
  const buttons = useRef(new Map<string, HTMLButtonElement>());

  const { from, to } = monthRange(month);
  const [focusDate, setFocusDate] = useState<string>(selectedDate ?? from);
  // Keep the tab stop inside this month.
  const tabDate = focusDate >= from && focusDate <= to ? focusDate : (selectedDate ?? from);

  useEffect(() => {
    if (selectedDate) setFocusDate(selectedDate);
  }, [selectedDate]);

  // Arrow keys move real focus — but only while focus is already in the grid.
  useEffect(() => {
    if (gridRef.current?.contains(document.activeElement)) buttons.current.get(focusDate)?.focus();
  }, [focusDate]);

  const byDate = new Map((days ?? []).map((d) => [d.date, d]));
  const lead = isoWeekday(from) - 1;
  const cells: (string | null)[] = [...Array<null>(lead).fill(null)];
  for (let d = from; d <= to; d = addDays(d, 1)) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 };
    let next: string | null = null;
    if (event.key in moves) next = addDays(tabDate, moves[event.key]!);
    else if (event.key === "Home") next = addDays(tabDate, -(isoWeekday(tabDate) - 1));
    else if (event.key === "End") next = addDays(tabDate, 7 - isoWeekday(tabDate));
    if (!next) return;
    event.preventDefault();
    setFocusDate(next < from ? from : next > to ? to : next);
  };

  const label = (date: string, day: Day | undefined) => {
    const name = formatDayLong(date, locale);
    const extra = date === today ? ` (${s.today})` : "";
    if (!day) return name + extra;
    if (day.status === "available")
      return `${name}${extra}, ${day.freeCount === 1 ? s.freeOne : fill(s.freeMany, { n: day.freeCount })}`;
    if (day.status === "busy") return `${name}${extra}, ${s.busyDay}`;
    return `${name}${extra}, ${s.closedDay}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h3 id={headingId} aria-live="polite" className="font-exo text-xl font-bold tracking-[-0.02em] text-foreground">
          {formatMonth(month, locale)}
        </h3>
        <div className="flex gap-1">
          <button
            type="button"
            // aria-disabled, not disabled: a disabled button drops keyboard focus to <body>.
            onClick={() => canPrev && onMonthChange(-1)}
            aria-disabled={!canPrev}
            aria-label={s.prevMonth}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring aria-disabled:cursor-not-allowed aria-disabled:opacity-30 aria-disabled:hover:bg-transparent"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => canNext && onMonthChange(1)}
            aria-disabled={!canNext}
            aria-label={s.nextMonth}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring aria-disabled:cursor-not-allowed aria-disabled:opacity-30 aria-disabled:hover:bg-transparent"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={gridRef}
        role="grid"
        aria-labelledby={headingId}
        aria-busy={days === null}
        onKeyDown={onKeyDown}
        className="mt-5"
      >
        <div role="row" className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {s.weekdaysShort.map((w) => (
            <div
              key={w}
              role="columnheader"
              className="pb-2 text-center text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground"
            >
              {w}
            </div>
          ))}
        </div>
        {weeks.map((week, i) => (
          <div key={i} role="row" className="mt-1 grid grid-cols-7 gap-1 sm:mt-1.5 sm:gap-1.5">
            {week.map((date, j) => {
              if (!date) return <div key={`blank-${j}`} role="gridcell" />;
              const day = byDate.get(date);
              const selectable = day?.status === "available" || day?.status === "busy";
              const selected = date === selectedDate;
              return (
                <div key={date} role="gridcell" aria-selected={selected}>
                  <button
                    ref={(el) => {
                      if (el) buttons.current.set(date, el);
                      else buttons.current.delete(date);
                    }}
                    type="button"
                    tabIndex={date === tabDate ? 0 : -1}
                    aria-label={label(date, day)}
                    aria-disabled={!selectable}
                    aria-current={date === today ? "date" : undefined}
                    onClick={() => {
                      setFocusDate(date);
                      if (selectable) onSelect(date);
                    }}
                    className={cn(
                      "relative flex h-11 w-full flex-col items-center justify-center rounded-xl text-sm tabular-nums transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:h-14 sm:text-base",
                      !day && "animate-pulse bg-muted text-transparent",
                      day?.status === "available" &&
                        !selected &&
                        "bg-secondary/[0.09] font-bold text-foreground hover:bg-secondary/[0.18]",
                      day?.status === "busy" && !selected && "bg-muted text-muted-foreground hover:bg-foreground/[0.08]",
                      day?.status === "closed" && "cursor-default text-foreground/35",
                      selected && "bg-primary font-bold text-primary-foreground",
                      date === today && !selected && "ring-1 ring-inset ring-foreground/25",
                    )}
                  >
                    <span aria-hidden="true">{Number(date.slice(8))}</span>
                    {day && day.status !== "closed" && (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute bottom-1.5 h-1.5 w-1.5 rounded-full sm:bottom-2",
                          day.status === "available" && (selected ? "bg-primary-foreground" : "bg-secondary"),
                          day.status === "busy" && (selected ? "bg-primary-foreground" : "bg-destructive"),
                        )}
                      />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-secondary" />
          {s.legendAvailable}
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-destructive" />
          {s.legendBusy}
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-2 rounded-full border border-foreground/35" />
          {s.legendClosed}
        </li>
      </ul>
    </div>
  );
}
