// Booking logic: Lisbon time, holidays, slot statuses, validation, .ics.
// Run: npm test   (Node's built-in runner; Node strips the TypeScript types)
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  SCHEDULE,
  addDays,
  buildDay,
  buildDays,
  checkSlot,
  dateKeyInZone,
  easterSunday,
  holidays,
  isDateKey,
  isoWeekday,
  monthRange,
  utcRangeForDays,
  zoneOffsetMinutes,
  zonedTimeToUtc,
} from "../src/lib/scheduling/availability.ts";
import { buildIcs, googleCalendarUrl } from "../src/lib/scheduling/ics.ts";
import { validateBooking } from "../src/lib/scheduling/validate.ts";

const TZ = "Europe/Lisbon";
// Wednesday 7 Oct 2026, 09:00 in Lisbon (summer time, UTC+1).
const NOW = new Date("2026-10-07T08:00:00Z");

describe("Lisbon time", () => {
  it("knows summer and winter offsets", () => {
    assert.equal(zoneOffsetMinutes(new Date("2026-07-01T12:00:00Z"), TZ), 60);
    assert.equal(zoneOffsetMinutes(new Date("2026-12-01T12:00:00Z"), TZ), 0);
  });

  it("converts wall-clock time to UTC on both sides of the October switch (25 Oct 2026)", () => {
    assert.equal(zonedTimeToUtc("2026-10-23", "10:00", TZ).toISOString(), "2026-10-23T09:00:00.000Z");
    assert.equal(zonedTimeToUtc("2026-10-26", "10:00", TZ).toISOString(), "2026-10-26T10:00:00.000Z");
  });

  it("converts across the March switch (29 Mar 2026)", () => {
    assert.equal(zonedTimeToUtc("2026-03-27", "10:00", TZ).toISOString(), "2026-03-27T10:00:00.000Z");
    assert.equal(zonedTimeToUtc("2026-03-30", "10:00", TZ).toISOString(), "2026-03-30T09:00:00.000Z");
  });

  it("puts late-evening UTC instants on the next Lisbon day in summer", () => {
    assert.equal(dateKeyInZone(new Date("2026-10-24T23:30:00Z"), TZ), "2026-10-25");
    assert.equal(dateKeyInZone(new Date("2026-12-24T23:30:00Z"), TZ), "2026-12-24");
  });

  it("covers whole Lisbon days in UTC, 25-hour day included", () => {
    const r = utcRangeForDays("2026-10-25", "2026-10-25");
    assert.equal(r.start.toISOString(), "2026-10-24T23:00:00.000Z");
    assert.equal(r.end.toISOString(), "2026-10-26T00:00:00.000Z");
  });
});

describe("calendar helpers", () => {
  it("validates date keys", () => {
    assert.ok(isDateKey("2028-02-29"));
    assert.ok(!isDateKey("2027-02-29"));
    assert.ok(!isDateKey("2026-13-01"));
    assert.ok(!isDateKey("2026-1-01"));
  });

  it("adds days across month and year ends", () => {
    assert.equal(addDays("2026-12-31", 1), "2027-01-01");
    assert.equal(addDays("2026-03-01", -1), "2026-02-28");
  });

  it("gives ISO weekdays", () => {
    assert.equal(isoWeekday("2026-10-05"), 1); // Monday
    assert.equal(isoWeekday("2026-10-11"), 7); // Sunday
  });

  it("gives month ranges, leap years included", () => {
    assert.deepEqual(monthRange("2026-02"), { from: "2026-02-01", to: "2026-02-28" });
    assert.deepEqual(monthRange("2028-02"), { from: "2028-02-01", to: "2028-02-29" });
    assert.throws(() => monthRange("2026-13"));
  });
});

describe("Portuguese holidays", () => {
  it("computes Easter", () => {
    assert.equal(easterSunday(2024), "2024-03-31");
    assert.equal(easterSunday(2026), "2026-04-05");
    assert.equal(easterSunday(2027), "2027-03-28");
  });

  it("includes the movable and the fixed national holidays plus Santo António", () => {
    const h = holidays(2026);
    for (const d of ["2026-04-03", "2026-04-05", "2026-06-04", "2026-10-05", "2026-12-01", "2026-12-08", "2026-06-13", "2026-04-25"]) {
      assert.ok(h.has(d), d);
    }
    assert.ok(!h.has("2026-10-06"));
  });
});

describe("days and slots", () => {
  it("lists the working day's slots in Lisbon time", () => {
    const day = buildDay("2026-10-08", NOW, []);
    assert.equal(day.status, "available");
    assert.equal(day.slots.length, 14); // 10:00–13:00 and 14:00–18:00, every 30 min
    assert.equal(day.freeCount, 14);
    assert.equal(day.slots[0].start, "2026-10-08T09:00:00.000Z");
    assert.equal(day.slots[0].label, "10:00");
    assert.equal(day.slots[6].label, "14:00");
    assert.equal(day.slots.at(-1).label, "17:30");
    assert.equal(day.slots.at(-1).end, "2026-10-08T17:00:00.000Z");
  });

  it("keeps labels on the local clock after the switch to winter time", () => {
    const day = buildDay("2026-10-26", NOW, []);
    assert.equal(day.slots[0].start, "2026-10-26T10:00:00.000Z");
    assert.equal(day.slots[0].label, "10:00");
  });

  it("closes weekends, holidays, the past and beyond the horizon", () => {
    assert.deepEqual([buildDay("2026-10-10", NOW, []).status, buildDay("2026-10-10", NOW, []).reason], ["closed", "weekend"]);
    assert.equal(buildDay("2026-12-01", NOW, []).reason, "holiday");
    assert.equal(buildDay("2026-10-06", NOW, []).reason, "past");
    assert.equal(buildDay(addDays("2026-10-07", SCHEDULE.horizonDays + 1), NOW, []).reason, "beyond");
  });

  it("respects the minimum notice", () => {
    // 09:00 Lisbon on Wed 7 Oct: with 12 h notice nothing today is bookable…
    const today = buildDay("2026-10-07", NOW, []);
    assert.equal(today.status, "closed");
    assert.equal(today.reason, "past");
    assert.ok(today.slots.every((s) => s.status === "past"));
    // …and tomorrow from 10:00 is (21:00 Lisbon today + 12 h = 09:00 tomorrow).
    const tomorrow = buildDay("2026-10-08", new Date("2026-10-07T20:00:00Z"), []);
    assert.equal(tomorrow.slots[0].status, "free");
    const later = buildDay("2026-10-08", new Date("2026-10-07T21:30:00Z"), []);
    assert.equal(later.slots[0].status, "past"); // 10:00 is 11.5 h away at 22:30
    assert.equal(later.slots[1].status, "free"); // 10:30 is exactly 12 h away: allowed
  });

  it("marks taken slots and turns a fully taken day busy", () => {
    const one = buildDay("2026-10-09", NOW, [{ start: new Date("2026-10-09T09:00:00Z"), end: new Date("2026-10-09T09:30:00Z") }]);
    assert.equal(one.slots[0].status, "busy");
    assert.equal(one.freeCount, 13);
    assert.equal(one.status, "available");

    const allDay = [{ start: zonedTimeToUtc("2026-10-09", "00:00", TZ), end: zonedTimeToUtc("2026-10-10", "00:00", TZ) }];
    const full = buildDay("2026-10-09", NOW, allDay);
    assert.equal(full.status, "busy");
    assert.equal(full.freeCount, 0);
    assert.ok(full.slots.every((s) => s.status === "busy"));
  });

  it("treats partial overlaps as taken, touching edges as free", () => {
    const busy = [{ start: new Date("2026-10-09T09:15:00Z"), end: new Date("2026-10-09T10:00:00Z") }];
    const day = buildDay("2026-10-09", NOW, busy);
    assert.equal(day.slots[0].status, "busy"); // 09:00–09:30Z overlaps 09:15
    assert.equal(day.slots[1].status, "busy"); // 09:30–10:00Z
    assert.equal(day.slots[2].status, "free"); // 10:00Z starts as the block ends
  });

  it("builds a whole month", () => {
    const { from, to } = monthRange("2026-10");
    const days = buildDays(from, to, NOW, []);
    assert.equal(days.length, 31);
    assert.equal(days.filter((d) => d.status === "available").length, 17); // 8–30 Oct, weekdays
  });
});

describe("checkSlot", () => {
  const busy = [{ start: new Date("2026-10-09T09:00:00Z"), end: new Date("2026-10-09T09:30:00Z") }];
  it("accepts a free slot", () => {
    const r = checkSlot("2026-10-09T09:30:00.000Z", NOW, busy);
    assert.ok(r.ok);
    assert.equal(r.slot.label, "10:30");
  });
  it("accepts the same instant written differently", () => {
    assert.ok(checkSlot("2026-10-09T10:30:00+01:00", NOW, busy).ok);
  });
  it("refuses taken, off-grid, past, weekend and garbage", () => {
    assert.deepEqual(checkSlot("2026-10-09T09:00:00.000Z", NOW, busy), { ok: false, reason: "taken" });
    assert.deepEqual(checkSlot("2026-10-09T09:15:00.000Z", NOW, busy), { ok: false, reason: "unavailable" });
    assert.deepEqual(checkSlot("2026-10-07T13:00:00.000Z", NOW, busy), { ok: false, reason: "unavailable" });
    assert.deepEqual(checkSlot("2026-10-10T09:00:00.000Z", NOW, busy), { ok: false, reason: "unavailable" });
    assert.deepEqual(checkSlot("2026-10-09T12:00:00.000Z", NOW, busy), { ok: false, reason: "unavailable" }); // 13:00 lunch
    assert.deepEqual(checkSlot("not a date", NOW, busy), { ok: false, reason: "invalid" });
  });
});

describe("validateBooking", () => {
  const good = {
    slotStart: "2026-10-09T09:30:00.000Z",
    name: "  Ana   Silva ",
    email: "Ana@Example.PT",
    company: "",
    phone: "+351 912 345 678",
    message: "Olá\r\nlinha 2",
    consent: true,
    locale: "pt",
    website: "",
  };

  it("accepts and normalises a good request", () => {
    const r = validateBooking(good);
    assert.ok(r.ok);
    assert.equal(r.data.name, "Ana Silva");
    assert.equal(r.data.email, "ana@example.pt");
    assert.equal(r.data.message, "Olá\nlinha 2");
  });

  it("reports each problem by field", () => {
    const r = validateBooking({ ...good, name: "", email: "ana@", consent: "yes", phone: "12", slotStart: "x" });
    assert.ok(!r.ok);
    assert.deepEqual(r.errors, { slotStart: "required", name: "required", email: "invalid", phone: "invalid", consent: "required" });
  });

  it("limits lengths", () => {
    const r = validateBooking({ ...good, name: "a".repeat(101), message: "m".repeat(1001), company: "c".repeat(121) });
    assert.ok(!r.ok);
    assert.equal(r.errors.name, "tooLong");
    assert.equal(r.errors.message, "tooLong");
    assert.equal(r.errors.company, "tooLong");
  });

  it("survives junk input", () => {
    for (const junk of [null, undefined, 42, "x", []]) assert.equal(validateBooking(junk).ok, false);
  });

  it("defaults the locale and keeps the honeypot", () => {
    const r = validateBooking({ ...good, locale: "fr", website: "http://spam" });
    assert.ok(r.ok);
    assert.equal(r.data.locale, "pt");
    assert.equal(r.data.website, "http://spam");
  });
});

describe("calendar files", () => {
  const event = {
    uid: "abc@neroes.tech",
    start: new Date("2026-10-09T09:30:00Z"),
    end: new Date("2026-10-09T10:00:00Z"),
    title: "Conversa com a Neroes",
    description: "Linha 1, com vírgula; e ponto e vírgula\nLinha 2 — " + "texto longo ".repeat(10),
    organizerEmail: "info@neroes.tech",
    attendee: { name: "Ana, Silva", email: "ana@example.pt" },
  };

  it("writes a valid iCalendar event", () => {
    const ics = buildIcs(event, new Date("2026-10-07T08:00:00Z"));
    assert.ok(ics.startsWith("BEGIN:VCALENDAR\r\n"));
    assert.ok(ics.endsWith("END:VCALENDAR\r\n"));
    assert.ok(!/[^\r]\n/.test(ics), "only CRLF line breaks");
    assert.match(ics, /\r\nDTSTART:20261009T093000Z\r\n/);
    assert.match(ics, /\r\nDTEND:20261009T100000Z\r\n/);
    assert.match(ics, /DESCRIPTION:Linha 1\\, com vírgula\\; e ponto e vírgula\\nLinha 2/);
    assert.match(ics, /ATTENDEE;CN="Ana, Silva";ROLE=REQ-PARTICIPANT:mailto:ana@example.pt/);
    for (const line of ics.split("\r\n")) assert.ok(new TextEncoder().encode(line).length <= 75, line);
  });

  it("quotes attendee names with colons, semicolons and quotes", () => {
    const ics = buildIcs({ ...event, attendee: { name: 'ACME: Ana; "Zé"', email: "ana@example.pt" } });
    const unfolded = ics.replace(/\r\n /g, "");
    assert.match(unfolded, /\r\nATTENDEE;CN="ACME: Ana; 'Zé'";ROLE=REQ-PARTICIPANT:mailto:ana@example.pt\r\n/);
  });

  it("links to Google Calendar with the same times", () => {
    const url = new URL(googleCalendarUrl(event));
    assert.equal(url.searchParams.get("dates"), "20261009T093000Z/20261009T100000Z");
    assert.equal(url.searchParams.get("text"), "Conversa com a Neroes");
  });
});
