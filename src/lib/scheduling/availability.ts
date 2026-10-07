/**
 * Booking availability: the team's opening hours, Lisbon time (with its
 * summer/winter switch), Portuguese public holidays, and which slots are free,
 * taken or past. Pure functions with no imports — the API routes, the
 * scheduler UI and the tests (tests/scheduling.test.mjs, run by plain Node)
 * all share it.
 *
 * Every instant crosses the network as an ISO string in UTC; dates are
 * "YYYY-MM-DD" calendar days in Lisbon.
 */

/** Hours the team takes conversations. Edit here — the site and the API follow. */
export const SCHEDULE = {
  timeZone: "Europe/Lisbon",
  slotMinutes: 30,
  /** ISO weekday (1 = Monday … 7 = Sunday) → [start, end) windows, local time. */
  weeklyHours: {
    1: [["10:00", "13:00"], ["14:00", "18:00"]],
    2: [["10:00", "13:00"], ["14:00", "18:00"]],
    3: [["10:00", "13:00"], ["14:00", "18:00"]],
    4: [["10:00", "13:00"], ["14:00", "18:00"]],
    5: [["10:00", "13:00"], ["14:00", "18:00"]],
  } as Partial<Record<number, ReadonlyArray<readonly [string, string]>>>,
  /** A slot must start at least this long after the booking is made. */
  minNoticeMinutes: 12 * 60,
  /** How far ahead the calendar opens, in days from today. */
  horizonDays: 60,
  /** Extra closed days ("YYYY-MM-DD"), e.g. a team offsite. */
  closedDates: [] as string[],
} as const;

export type DayStatus = "available" | "busy" | "closed";
export type ClosedReason = "weekend" | "holiday" | "past" | "beyond" | "closed";
export type SlotStatus = "free" | "busy" | "past";

export interface Slot {
  /** UTC ISO instant. */
  start: string;
  end: string;
  /** "HH:MM" in Lisbon. */
  label: string;
  status: SlotStatus;
}

export interface Day {
  date: string;
  status: DayStatus;
  reason?: ClosedReason;
  slots: Slot[];
  freeCount: number;
}

export interface Interval {
  start: Date;
  end: Date;
}

// ── Calendar dates ─────────────────────────────────────────────────────────

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isDateKey(value: string): boolean {
  const m = DATE_RE.exec(value);
  if (!m) return false;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return d.toISOString().slice(0, 10) === value;
}

function parts(date: string): [number, number, number] {
  const m = DATE_RE.exec(date);
  if (!m) throw new Error(`Invalid date: ${date}`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

export function addDays(date: string, days: number): string {
  const [y, m, d] = parts(date);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/** ISO weekday of a calendar date: 1 = Monday … 7 = Sunday. */
export function isoWeekday(date: string): number {
  const [y, m, d] = parts(date);
  const day = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return day === 0 ? 7 : day;
}

/** First and last calendar day of a "YYYY-MM" month. */
export function monthRange(month: string): { from: string; to: string } {
  const m = /^(\d{4})-(\d{2})$/.exec(month);
  if (!m) throw new Error(`Invalid month: ${month}`);
  const y = Number(m[1]);
  const mo = Number(m[2]);
  if (mo < 1 || mo > 12) throw new Error(`Invalid month: ${month}`);
  const from = `${m[1]}-${m[2]}-01`;
  const to = new Date(Date.UTC(y, mo, 0)).toISOString().slice(0, 10);
  return { from, to };
}

// ── Lisbon time ────────────────────────────────────────────────────────────

const formatters = new Map<string, Intl.DateTimeFormat>();
function zoneFormatter(timeZone: string): Intl.DateTimeFormat {
  let f = formatters.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    formatters.set(timeZone, f);
  }
  return f;
}

function zoneParts(instant: Date, timeZone: string) {
  const out: Record<string, number> = {};
  for (const p of zoneFormatter(timeZone).formatToParts(instant)) {
    if (p.type !== "literal") out[p.type] = Number(p.value);
  }
  return {
    year: out.year!,
    month: out.month!,
    day: out.day!,
    hour: out.hour === 24 ? 0 : out.hour!,
    minute: out.minute!,
    second: out.second!,
  };
}

/** Minutes the zone is ahead of UTC at that instant (Lisbon: 0 in winter, 60 in summer). */
export function zoneOffsetMinutes(instant: Date, timeZone: string): number {
  const p = zoneParts(instant, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return Math.round((asUtc - Math.floor(instant.getTime() / 1000) * 1000) / 60000);
}

/** The UTC instant of a local wall-clock time ("YYYY-MM-DD", "HH:MM") in the zone. */
export function zonedTimeToUtc(date: string, time: string, timeZone: string): Date {
  const [y, m, d] = parts(date);
  const [hh, mm] = time.split(":").map(Number) as [number, number];
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  const first = guess - zoneOffsetMinutes(new Date(guess), timeZone) * 60000;
  // Second pass settles instants right after a summer/winter switch.
  const second = guess - zoneOffsetMinutes(new Date(first), timeZone) * 60000;
  return new Date(second);
}

/** The calendar day ("YYYY-MM-DD") an instant falls on in the zone. */
export function dateKeyInZone(instant: Date, timeZone: string): string {
  const p = zoneParts(instant, timeZone);
  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}

/** "HH:MM" of an instant in the zone. */
export function timeLabelInZone(instant: Date, timeZone: string): string {
  const p = zoneParts(instant, timeZone);
  return `${String(p.hour).padStart(2, "0")}:${String(p.minute).padStart(2, "0")}`;
}

// ── Holidays ───────────────────────────────────────────────────────────────

/** Easter Sunday (Gregorian), "YYYY-MM-DD" — anonymous Gregorian algorithm. */
export function easterSunday(year: number): string {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const holidayCache = new Map<number, Set<string>>();

/**
 * Portugal's national public holidays (Código do Trabalho, art. 234.º) plus
 * Lisbon's municipal holiday (Santo António, 13 June).
 */
export function holidays(year: number): Set<string> {
  let set = holidayCache.get(year);
  if (set) return set;
  const easter = easterSunday(year);
  const fixed = ["01-01", "04-25", "05-01", "06-10", "06-13", "08-15", "10-05", "11-01", "12-01", "12-08", "12-25"];
  set = new Set([
    ...fixed.map((md) => `${year}-${md}`),
    addDays(easter, -2), // Sexta-feira Santa
    easter, // Páscoa
    addDays(easter, 60), // Corpo de Deus
  ]);
  holidayCache.set(year, set);
  return set;
}

// ── Availability ───────────────────────────────────────────────────────────

function overlaps(start: number, end: number, busy: Interval[]): boolean {
  return busy.some((b) => start < b.end.getTime() && end > b.start.getTime());
}

/** Today in Lisbon and the last bookable day. */
export function bookingWindow(now: Date, schedule = SCHEDULE): { today: string; last: string } {
  const today = dateKeyInZone(now, schedule.timeZone);
  return { today, last: addDays(today, schedule.horizonDays) };
}

/** One calendar day with every slot's status. */
export function buildDay(date: string, now: Date, busy: Interval[], schedule = SCHEDULE): Day {
  const { today, last } = bookingWindow(now, schedule);
  const closed = (reason: ClosedReason): Day => ({ date, status: "closed", reason, slots: [], freeCount: 0 });

  if (date < today) return closed("past");
  if (date > last) return closed("beyond");
  const windows = schedule.weeklyHours[isoWeekday(date)];
  if (!windows || windows.length === 0) return closed("weekend");
  if (holidays(Number(date.slice(0, 4))).has(date)) return closed("holiday");
  if (schedule.closedDates.includes(date)) return closed("closed");

  const earliest = now.getTime() + schedule.minNoticeMinutes * 60000;
  const step = schedule.slotMinutes * 60000;
  const slots: Slot[] = [];
  for (const [from, to] of windows) {
    const windowEnd = zonedTimeToUtc(date, to, schedule.timeZone).getTime();
    for (let t = zonedTimeToUtc(date, from, schedule.timeZone).getTime(); t + step <= windowEnd; t += step) {
      const status: SlotStatus = t < earliest ? "past" : overlaps(t, t + step, busy) ? "busy" : "free";
      slots.push({
        start: new Date(t).toISOString(),
        end: new Date(t + step).toISOString(),
        label: timeLabelInZone(new Date(t), schedule.timeZone),
        status,
      });
    }
  }

  const freeCount = slots.filter((s) => s.status === "free").length;
  if (freeCount > 0) return { date, status: "available", slots, freeCount };
  // No free slot left: taken (by bookings or blocks) if any slot was still
  // ahead, otherwise the day has simply run out (today, after hours).
  if (slots.some((s) => s.status === "busy")) return { date, status: "busy", slots, freeCount };
  return { date, status: "closed", reason: "past", slots, freeCount };
}

/** Every day from `from` to `to` (inclusive). */
export function buildDays(from: string, to: string, now: Date, busy: Interval[], schedule = SCHEDULE): Day[] {
  const days: Day[] = [];
  for (let d = from; d <= to; d = addDays(d, 1)) days.push(buildDay(d, now, busy, schedule));
  return days;
}

/** The UTC range that covers the given calendar days in Lisbon. */
export function utcRangeForDays(from: string, to: string, schedule = SCHEDULE): Interval {
  return {
    start: zonedTimeToUtc(from, "00:00", schedule.timeZone),
    end: zonedTimeToUtc(addDays(to, 1), "00:00", schedule.timeZone),
  };
}

/**
 * Checks a requested slot against the schedule and what is already taken.
 * Returns the matching slot when it is free, otherwise why not.
 */
export function checkSlot(
  startIso: string,
  now: Date,
  busy: Interval[],
  schedule = SCHEDULE,
): { ok: true; slot: Slot } | { ok: false; reason: "invalid" | "unavailable" | "taken" } {
  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) return { ok: false, reason: "invalid" };
  const day = buildDay(dateKeyInZone(start, schedule.timeZone), now, busy, schedule);
  const slot = day.slots.find((s) => s.start === start.toISOString());
  if (!slot || slot.status === "past") return { ok: false, reason: "unavailable" };
  if (slot.status === "busy") return { ok: false, reason: "taken" };
  return { ok: true, slot };
}
