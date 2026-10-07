// End-to-end checks of the booking API against a running local server with
// the file store (npm run dev). Bookings it makes are rolled back at the end.
//
//   BASE=http://localhost:3000 node --test tests/e2e/booking-api.e2e.mjs
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";

const BASE = process.env.BASE ?? "http://localhost:3000";
// Same default as defaultBookingFile() in src/lib/scheduling/store.ts.
const FILE = process.env.BOOKING_FILE ?? path.join(tmpdir(), "neroes-website", "bookings.json");
let ipSeq = 0;
const nextIp = () => `203.0.113.${++ipSeq}`;

const post = (body, ip = nextIp(), headers = {}) =>
  fetch(`${BASE}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Forwarded-For": ip, ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
let emailSeq = 0;
const availability = async (month) => {
  const res = await fetch(`${BASE}/api/availability${month ? `?month=${month}` : ""}`);
  return { status: res.status, body: await res.json() };
};
const person = (over = {}) => ({
  name: "Teste Automático",
  // A fresh address each time: one email may hold only 2 upcoming bookings.
  email: `teste${++emailSeq}@example.pt`,
  company: "Neroes QA",
  phone: "+351 912 345 678",
  message: "Teste ponta a ponta",
  consent: true,
  locale: "pt",
  website: "",
  ...over,
});

let backup = null;
let freeSlots = [];
let months = [];

before(async () => {
  backup = existsSync(FILE) ? await readFile(FILE, "utf8") : null;
  const first = await availability();
  assert.equal(first.status, 200, "is the dev server running with the file store?");
  months = [first.body.month];
  if (first.body.maxMonth > first.body.month) months.push((await availability(nextMonth(first.body.month))).body.month);
  for (const month of months) {
    const { body } = await availability(month);
    for (const day of body.days) for (const slot of day.slots) if (slot.status === "free") freeSlots.push(slot);
  }
  assert.ok(freeSlots.length >= 9, "needs a few free slots to test with");
});

after(async () => {
  await mkdir(path.dirname(FILE), { recursive: true });
  if (backup === null) await writeFile(FILE, JSON.stringify({ bookings: [], blocks: [] }, null, 2) + "\n");
  else await writeFile(FILE, backup);
});

function nextMonth(month) {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

describe("GET /api/availability", () => {
  it("returns the month in Lisbon time with every day", async () => {
    const { status, body } = await availability();
    assert.equal(status, 200);
    assert.equal(body.timeZone, "Europe/Lisbon");
    assert.equal(body.slotMinutes, 30);
    const [y, m] = body.month.split("-").map(Number);
    assert.equal(body.days.length, new Date(Date.UTC(y, m, 0)).getUTCDate());
    for (const day of body.days) assert.ok(["available", "busy", "closed"].includes(day.status));
    // No personal data in availability.
    assert.ok(!JSON.stringify(body).includes("@"));
  });

  it("refuses months outside the booking window", async () => {
    assert.equal((await availability("1999-01")).status, 400);
    assert.equal((await availability("2026-13")).status, 400);
    assert.equal((await availability("garbage")).status, 400);
  });
});

describe("POST /api/bookings", () => {
  it("rejects malformed JSON and invalid fields", async () => {
    let res = await post("{not json");
    assert.equal(res.status, 400);
    assert.equal((await res.json()).error, "bad_json");

    res = await post({ slotStart: freeSlots[0].start, name: "", email: "x", consent: false });
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.error, "validation");
    assert.deepEqual(Object.keys(body.fields).sort(), ["consent", "email", "name"]);
  });

  it("books a free slot once; the second attempt gets 409 and the slot shows busy", async () => {
    const slot = freeSlots[0];
    let res = await post(person({ slotStart: slot.start }));
    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.booking.start, slot.start);
    assert.equal(body.booking.end, slot.end);
    assert.match(body.booking.id, /^[0-9a-f-]{36}$/);
    assert.equal(typeof body.email.configured, "boolean");

    res = await post(person({ slotStart: slot.start, email: "outra@example.pt" }));
    assert.equal(res.status, 409);
    assert.equal((await res.json()).error, "taken");

    const month = slot.start.slice(0, 7);
    const { body: after } = await availability(months.includes(month) ? month : undefined);
    const again = after.days.flatMap((d) => d.slots).find((s) => s.start === slot.start);
    assert.equal(again?.status, "busy");
  });

  it("accepts the same instant written with an offset", async () => {
    const slot = freeSlots[1];
    const d = new Date(slot.start);
    const withOffset = new Date(d.getTime() + 60 * 60000).toISOString().replace("Z", "+01:00");
    const res = await post(person({ slotStart: withOffset }));
    assert.equal(res.status, 201);
    assert.equal((await res.json()).booking.start, slot.start);
  });

  it("refuses slots that are off the grid, in the past or on a weekend", async () => {
    const offGrid = new Date(new Date(freeSlots[2].start).getTime() + 15 * 60000).toISOString();
    assert.equal((await post(person({ slotStart: offGrid }))).status, 422);
    assert.equal((await post(person({ slotStart: "2020-01-06T10:00:00.000Z" }))).status, 422);
    // Find a Saturday in the window.
    const { body } = await availability(months[0]);
    const saturday = body.days.find((d) => d.reason === "weekend");
    if (saturday) assert.equal((await post(person({ slotStart: `${saturday.date}T10:00:00.000Z` }))).status, 422);
  });

  it("lets exactly one of five simultaneous requests take a slot", async () => {
    const slot = freeSlots[3];
    const results = await Promise.all(Array.from({ length: 5 }, (_, i) => post(person({ slotStart: slot.start, email: `p${i}@example.pt` }))));
    const statuses = results.map((r) => r.status).sort();
    assert.deepEqual(statuses, [201, 409, 409, 409, 409]);
  });

  it("answers bots that fill the honeypot as if it worked, without booking", async () => {
    const slot = freeSlots[4];
    const res = await post(person({ slotStart: slot.start, website: "http://spam.example" }));
    assert.equal(res.status, 201);
    assert.equal((await res.json()).booking, null);
    const ok = await post(person({ slotStart: slot.start }));
    assert.equal(ok.status, 201, "the slot is still free for a person");
  });

  it("slows down a flood from one address (429)", async () => {
    const ip = "198.51.100.77";
    const statuses = [];
    for (let i = 0; i < 6; i++) statuses.push((await post({}, ip)).status);
    assert.deepEqual(statuses, [400, 400, 400, 400, 400, 429]);
  });

  it("refuses requests that aren't JSON or come from another site", async () => {
    const slot = freeSlots[5];
    let res = await post(JSON.stringify(person({ slotStart: slot.start })), nextIp(), { "Content-Type": "text/plain" });
    assert.equal(res.status, 415);
    res = await post(person({ slotStart: slot.start }), nextIp(), { "Sec-Fetch-Site": "cross-site", Origin: "https://evil.example" });
    assert.equal(res.status, 403);
    res = await post(person({ slotStart: slot.start }), nextIp(), { "Sec-Fetch-Site": "same-site" });
    assert.equal(res.status, 403);
  });

  it("lets one email hold at most 2 upcoming bookings", async () => {
    const email = "limite@example.pt";
    assert.equal((await post(person({ slotStart: freeSlots[6].start, email }))).status, 201);
    assert.equal((await post(person({ slotStart: freeSlots[7].start, email: "LIMITE@example.pt" }))).status, 201);
    const third = await post(person({ slotStart: freeSlots[8].start, email }));
    assert.equal(third.status, 429);
    assert.equal((await third.json()).error, "email_limit");
  });

  it("refuses oversized bodies", async () => {
    const res = await post(person({ slotStart: freeSlots[5].start, message: "x".repeat(20_000) }));
    assert.equal(res.status, 413);
  });
});
