// Booking storage: the file store, the Supabase store against a stand-in
// PostgREST server (same requests, same duplicate-key error), and how the
// store is chosen from the environment.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";

import { createFileStore, createMemoryStore, createSupabaseStore, getBookingStore, getSchedulerStore } from "../src/lib/scheduling/store.ts";

const booking = (start, over = {}) => ({
  slotStart: new Date(start),
  slotEnd: new Date(new Date(start).getTime() + 30 * 60000),
  name: "Ana Silva",
  email: "ana@example.pt",
  company: null,
  phone: null,
  message: null,
  locale: "pt",
  ...over,
});
const range = { start: new Date("2026-10-09T00:00:00Z"), end: new Date("2026-10-10T00:00:00Z") };

describe("file store", () => {
  let dir;
  before(async () => (dir = await mkdtemp(path.join(tmpdir(), "neroes-bookings-"))));
  after(async () => rm(dir, { recursive: true, force: true }));

  it("books a slot once, refuses it twice, and reports it busy", async () => {
    const store = createFileStore(path.join(dir, "a", "bookings.json"));
    assert.deepEqual(await store.busy(range), []);
    const first = await store.create(booking("2026-10-09T09:00:00Z"));
    assert.ok(first.ok);
    assert.match(first.booking.id, /^[0-9a-f-]{36}$/);
    assert.deepEqual(await store.create(booking("2026-10-09T09:00:00Z", { name: "Outro" })), { ok: false, reason: "taken" });
    const busy = await store.busy(range);
    assert.equal(busy.length, 1);
    assert.equal(busy[0].start.toISOString(), "2026-10-09T09:00:00.000Z");
    assert.equal((await store.busy({ start: new Date("2026-10-10T00:00:00Z"), end: new Date("2026-10-11T00:00:00Z") })).length, 0);
  });

  it("lets only one of many simultaneous requests take a slot", async () => {
    const store = createFileStore(path.join(dir, "race.json"));
    const results = await Promise.all(Array.from({ length: 10 }, () => store.create(booking("2026-10-09T10:00:00Z"))));
    assert.equal(results.filter((r) => r.ok).length, 1);
    const saved = JSON.parse(await readFile(path.join(dir, "race.json"), "utf8"));
    assert.equal(saved.bookings.length, 1);
  });

  it("counts usage and records notifications", async () => {
    const file = path.join(dir, "usage.json");
    const store = createFileStore(file);
    const created = await store.create(booking("2026-10-09T09:00:00Z"));
    await store.create(booking("2026-10-09T09:30:00Z", { email: "outra@example.pt" }));
    // Upcoming is relative to the given "now"; created-in-the-last-hour to the real clock.
    assert.equal((await store.usage("ana@example.pt", new Date("2026-10-08T00:00:00Z"))).upcomingForEmail, 1);
    assert.equal((await store.usage("ana@example.pt", new Date())).createdLastHour, 2);
    assert.equal((await store.usage("ana@example.pt", new Date("2026-10-10T00:00:00Z"))).upcomingForEmail, 0);
    const saved = () => readFile(file, "utf8").then((t) => JSON.parse(t).bookings.find((b) => b.id === created.booking.id));
    assert.equal((await saved()).team_notified, false);
    await store.markNotified(created.booking.id);
    assert.equal((await saved()).team_notified, true);
  });

  it("counts the team's blocks as busy and ignores cancelled bookings", async () => {
    const file = path.join(dir, "blocks.json");
    await writeFile(
      file,
      JSON.stringify({
        bookings: [{ id: "x", slot_start: "2026-10-09T11:00:00Z", slot_end: "2026-10-09T11:30:00Z", status: "cancelled" }],
        blocks: [{ starts_at: "2026-10-09T13:00:00Z", ends_at: "2026-10-09T17:00:00Z", reason: "Feira" }],
      }),
    );
    const store = createFileStore(file);
    const busy = await store.busy(range);
    assert.deepEqual(
      busy.map((b) => [b.start.toISOString(), b.end.toISOString()]),
      [["2026-10-09T13:00:00.000Z", "2026-10-09T17:00:00.000Z"]],
    );
    assert.ok((await store.create(booking("2026-10-09T11:00:00Z"))).ok, "a cancelled booking frees its slot");
  });
});

// ── A stand-in for Supabase's REST API (PostgREST), enough for our queries ──

function startPostgrest() {
  const db = {
    bookings: [],
    booking_blocks: [{ starts_at: "2026-10-09T15:00:00+00:00", ends_at: "2026-10-09T16:00:00+00:00" }],
  };
  const requests = [];
  const apply = (rows, params) =>
    rows.filter((row) =>
      [...params.entries()].every(([key, value]) => {
        if (["select", "columns"].includes(key)) return true;
        const [op, ...rest] = value.split(".");
        const arg = rest.join(".");
        const cell = row[key];
        if (op === "eq") return String(cell) === arg;
        const a = Date.parse(cell);
        const b = Date.parse(arg);
        if (op === "lt") return a < b;
        if (op === "gt") return a > b;
        throw new Error(`unsupported filter ${key}=${value}`);
      }),
    );
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, "http://x");
    const table = url.pathname.replace("/rest/v1/", "");
    let body = "";
    for await (const chunk of req) body += chunk;
    requests.push({ method: req.method, table, query: url.search, auth: req.headers.authorization, apikey: req.headers.apikey });
    const send = (status, payload) => {
      res.writeHead(status, { "content-type": "application/json" });
      res.end(JSON.stringify(payload));
    };
    if (!(table in db)) return send(404, { message: "relation does not exist" });
    if (req.method === "GET") return send(200, apply(db[table], url.searchParams));
    if (req.method === "HEAD") {
      // select(..., { count: "exact", head: true }) → the count travels in Content-Range.
      const n = apply(db[table], url.searchParams).length;
      res.writeHead(200, { "content-range": `*/${n}` });
      return res.end();
    }
    if (req.method === "PATCH") {
      const patch = JSON.parse(body);
      for (const row of apply(db[table], url.searchParams)) Object.assign(row, patch);
      res.writeHead(204);
      return res.end();
    }
    if (req.method === "POST" && table === "bookings") {
      const row = JSON.parse(body);
      const taken = db.bookings.some((b) => b.status === "confirmed" && Date.parse(b.slot_start) === Date.parse(row.slot_start));
      if (taken) return send(409, { code: "23505", message: 'duplicate key value violates unique constraint "bookings_slot_unique"' });
      const saved = { id: crypto.randomUUID(), status: "confirmed", created_at: new Date().toISOString(), ...row };
      db.bookings.push(saved);
      const single = String(req.headers.accept).includes("vnd.pgrst.object");
      return send(201, single ? { id: saved.id, created_at: saved.created_at } : [{ id: saved.id, created_at: saved.created_at }]);
    }
    send(405, { message: "method" });
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve({ server, db, requests, url: `http://127.0.0.1:${server.address().port}` })));
}

describe("Supabase store", () => {
  let api;
  before(async () => (api = await startPostgrest()));
  after(() => api.server.close());

  it("books through PostgREST and maps the duplicate-key error to 'taken'", async () => {
    const store = createSupabaseStore(api.url, "service-role-key");
    const first = await store.create(booking("2026-10-09T09:00:00Z", { company: "CCA", message: "Olá" }));
    assert.ok(first.ok, JSON.stringify(first));
    assert.equal(api.db.bookings[0].company, "CCA");
    assert.equal(api.db.bookings[0].slot_start, "2026-10-09T09:00:00.000Z");
    assert.deepEqual(await store.create(booking("2026-10-09T09:00:00Z")), { ok: false, reason: "taken" });
    const post = api.requests.find((r) => r.method === "POST");
    assert.equal(post.auth, "Bearer service-role-key");
    assert.equal(post.apikey, "service-role-key");
  });

  it("reads bookings and blocks overlapping the range", async () => {
    const store = createSupabaseStore(api.url, "service-role-key");
    const busy = await store.busy(range);
    assert.deepEqual(
      busy.map((b) => b.start.toISOString()).sort(),
      ["2026-10-09T09:00:00.000Z", "2026-10-09T15:00:00.000Z"],
    );
    const get = api.requests.filter((r) => r.method === "GET").map((r) => decodeURIComponent(r.query));
    assert.ok(get.some((q) => q.includes("status=eq.confirmed") && q.includes("slot_start=lt.") && q.includes("slot_end=gt.")));
    assert.ok(get.some((q) => q.includes("starts_at=lt.") && q.includes("ends_at=gt.")));
  });

  it("counts upcoming bookings per email and bookings made in the last hour", async () => {
    const store = createSupabaseStore(api.url, "service-role-key");
    assert.equal((await store.usage("ana@example.pt", new Date("2026-10-08T00:00:00Z"))).upcomingForEmail, 1);
    assert.equal((await store.usage("ana@example.pt", new Date())).createdLastHour, 1);
    assert.equal((await store.usage("ana@example.pt", new Date("2026-10-10T00:00:00Z"))).upcomingForEmail, 0);
    assert.equal((await store.usage("outra@example.pt", new Date("2026-10-08T00:00:00Z"))).upcomingForEmail, 0);
  });

  it("records that the team was notified", async () => {
    const store = createSupabaseStore(api.url, "service-role-key");
    const id = api.db.bookings[0].id;
    await store.markNotified(id);
    assert.equal(api.db.bookings[0].team_notified, true);
  });

  it("throws (so the API can answer 503) when the database is unreachable", async () => {
    const store = createSupabaseStore("http://127.0.0.1:9", "k");
    await assert.rejects(() => store.busy(range));
  });
});

describe("store selection", () => {
  const supa = { NEXT_PUBLIC_SUPABASE_URL: "https://x.supabase.co", SUPABASE_SERVICE_ROLE_KEY: "k" };
  it("is off in production unless asked for", () => {
    assert.equal(getBookingStore({ NODE_ENV: "production", ...supa }), null);
    assert.equal(getBookingStore({ NODE_ENV: "production", VERCEL: "1", ...supa }), null);
  });
  it("uses Supabase when BOOKING_STORE=supabase and the keys are there", () => {
    assert.equal(getBookingStore({ NODE_ENV: "production", BOOKING_STORE: "supabase", ...supa })?.kind, "supabase");
    assert.equal(getBookingStore({ NODE_ENV: "production", BOOKING_STORE: "supabase" }), null);
  });
  it("uses the file locally, never on Vercel, and can be switched off", () => {
    assert.equal(getBookingStore({ NODE_ENV: "development" })?.kind, "file");
    assert.equal(getBookingStore({ NODE_ENV: "development", ...supa })?.kind, "file");
    assert.equal(getBookingStore({ NODE_ENV: "development", BOOKING_STORE: "off" }), null);
    assert.equal(getBookingStore({ BOOKING_STORE: "file", VERCEL: "1" }), null);
  });
});

describe("agenda switch (store + email)", () => {
  const base = { BOOKING_STORE: "supabase", NEXT_PUBLIC_SUPABASE_URL: "https://x.supabase.co", SUPABASE_SERVICE_ROLE_KEY: "k" };
  const smtp = { SMTP_USER: "info@neroes.tech", SMTP_PASS: "abcd efgh ijkl mnop" };
  it("stays off online without email, so no booking goes unannounced", () => {
    assert.equal(getSchedulerStore({ NODE_ENV: "production", VERCEL: "1", ...base }), null);
    assert.equal(getSchedulerStore({ NODE_ENV: "production", ...base, SMTP_USER: "info@neroes.tech" }), null);
  });
  it("turns on online with store and email", () => {
    assert.equal(getSchedulerStore({ NODE_ENV: "production", VERCEL: "1", ...base, ...smtp })?.kind, "supabase");
  });
  it("can be forced on for a preview without email", () => {
    assert.equal(getSchedulerStore({ NODE_ENV: "production", VERCEL: "1", ...base, BOOKING_ALLOW_WITHOUT_EMAIL: "1" })?.kind, "supabase");
  });
  it("works locally without email (file store)", () => {
    assert.equal(getSchedulerStore({ NODE_ENV: "development" })?.kind, "file");
  });
});

describe("preview demo (memory store)", () => {
  it("books once, refuses twice, shows busy", async () => {
    const store = createMemoryStore();
    assert.equal(store.kind, "memory");
    const first = await store.create(booking("2026-10-20T09:00:00Z"));
    assert.ok(first.ok);
    assert.deepEqual(await store.create(booking("2026-10-20T09:00:00Z")), { ok: false, reason: "taken" });
    const busy = await store.busy({ start: new Date("2026-10-20T00:00:00Z"), end: new Date("2026-10-21T00:00:00Z") });
    assert.equal(busy.length, 1);
  });

  it("is what Vercel previews get without a database — and only previews", () => {
    const preview = { NODE_ENV: "production", VERCEL: "1", VERCEL_ENV: "preview" };
    assert.equal(getBookingStore(preview)?.kind, "memory");
    assert.equal(getSchedulerStore(preview)?.kind, "memory", "no email needed: nothing real is booked");
    assert.equal(getSchedulerStore({ NODE_ENV: "production", VERCEL: "1", VERCEL_ENV: "production" }), null);
    assert.equal(getSchedulerStore({ ...preview, BOOKING_STORE: "off" }), null);
  });

  it("gives way to the real database when one is configured", () => {
    const env = {
      NODE_ENV: "production",
      VERCEL: "1",
      VERCEL_ENV: "preview",
      BOOKING_STORE: "supabase",
      NEXT_PUBLIC_SUPABASE_URL: "https://x.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "k",
      SMTP_USER: "info@neroes.tech",
      SMTP_PASS: "x",
    };
    assert.equal(getSchedulerStore(env)?.kind, "supabase");
  });
});
