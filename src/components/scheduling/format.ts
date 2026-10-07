import { dateKeyInZone, type Day } from "@/lib/scheduling/availability";

export interface AvailabilityResponse {
  timeZone: string;
  slotMinutes: number;
  month: string;
  minMonth: string;
  maxMonth: string;
  today: string;
  days: Day[];
}

export type UiLocale = "pt" | "en";

const tag = (locale: UiLocale) => (locale === "pt" ? "pt-PT" : "en-GB");
const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** A calendar day ("YYYY-MM-DD") read at noon UTC, so no time zone can shift it. */
const noon = (date: string) => new Date(`${date}T12:00:00Z`);

/** "Quinta-feira, 8 de outubro" / "Thursday 8 October". */
export function formatDayLong(date: string, locale: UiLocale): string {
  return capitalise(
    new Intl.DateTimeFormat(tag(locale), { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" }).format(noon(date)),
  );
}

/** "Outubro de 2026" / "October 2026". */
export function formatMonth(month: string, locale: UiLocale): string {
  return capitalise(
    new Intl.DateTimeFormat(tag(locale), { timeZone: "UTC", month: "long", year: "numeric" }).format(noon(`${month}-01`)),
  );
}

/** "HH:MM" of an instant in a time zone. */
export function formatTime(iso: string, timeZone: string, locale: UiLocale): string {
  return new Intl.DateTimeFormat(tag(locale), { timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(
    new Date(iso),
  );
}

/**
 * A Lisbon slot's time in the visitor's own zone, with the weekday when it
 * falls on another day there ("sex. 02:30").
 */
export function formatVisitorTime(iso: string, visitorTimeZone: string, lisbonDate: string, locale: UiLocale): string {
  const time = formatTime(iso, visitorTimeZone, locale);
  if (dateKeyInZone(new Date(iso), visitorTimeZone) === lisbonDate) return time;
  const weekday = new Intl.DateTimeFormat(tag(locale), { timeZone: visitorTimeZone, weekday: "short" }).format(new Date(iso));
  return `${weekday} ${time}`;
}

/** The current month in Lisbon ("YYYY-MM"). */
export function lisbonMonth(now = new Date()): string {
  return dateKeyInZone(now, "Europe/Lisbon").slice(0, 7);
}

export function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split("-").map(Number) as [number, number];
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));
