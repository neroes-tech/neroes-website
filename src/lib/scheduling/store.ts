/**
 * Where bookings live. Server-only (it holds the Supabase service role key
 * and touches the file system) — never import it from a Client Component.
 *
 * - Supabase (production): tables `bookings` and `booking_blocks`
 *   (docs/sql/bookings.sql). A unique index on the slot start makes the
 *   database refuse a second booking for the same slot, whatever the timing.
 * - File (local development): bookings.json in the system temp folder —
 *   outside the project, so neither the dev server's file watcher nor
 *   OneDrive react to every booking — same behaviour. BOOKING_FILE overrides it.
 *
 * - Memory (demo): Vercel preview deployments with no database, so the team
 *   can try the agenda before Supabase exists. Nothing is kept or emailed.
 *
 * BOOKING_STORE picks one: "supabase" (needs NEXT_PUBLIC_SUPABASE_URL and
 * SUPABASE_SERVICE_ROLE_KEY), "file", "demo", or "off". Unset: "file" in local
 * development, "demo" on Vercel previews, off in production — the live agenda
 * only goes on when asked to, so stale Supabase variables can't switch on a
 * calendar that fails to load.
 */
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Interval } from "./availability";

export interface NewBooking {
  slotStart: Date;
  slotEnd: Date;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  message: string | null;
  locale: "pt" | "en";
}

export interface StoredBooking extends NewBooking {
  id: string;
  createdAt: Date;
}

export type CreateResult = { ok: true; booking: StoredBooking } | { ok: false; reason: "taken" };

/** Counts behind the abuse limits (src/app/api/bookings/route.ts). */
export interface Usage {
  /** Confirmed bookings still ahead for this (lower-cased) email. */
  upcomingForEmail: number;
  /** Bookings made by anyone in the last hour. */
  createdLastHour: number;
}

export interface BookingStore {
  readonly kind: "supabase" | "file" | "memory";
  /** Taken time — confirmed bookings and blocks set by the team — overlapping the range. */
  busy(range: Interval): Promise<Interval[]>;
  usage(email: string, now: Date): Promise<Usage>;
  create(booking: NewBooking): Promise<CreateResult>;
  /** Records that the team's email about this booking went out. */
  markNotified(id: string): Promise<void>;
}

const HOUR_MS = 60 * 60_000;

// ── Supabase ───────────────────────────────────────────────────────────────

export function createSupabaseStore(url: string, serviceRoleKey: string): BookingStore {
  const client: SupabaseClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    // Give up after 8 s rather than hold the request until the platform's timeout.
    global: { fetch: (input, init) => fetch(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(8000) }) },
  });

  return {
    kind: "supabase",

    async busy(range) {
      const start = range.start.toISOString();
      const end = range.end.toISOString();
      const [bookings, blocks] = await Promise.all([
        client
          .from("bookings")
          .select("slot_start, slot_end")
          .eq("status", "confirmed")
          .lt("slot_start", end)
          .gt("slot_end", start),
        client.from("booking_blocks").select("starts_at, ends_at").lt("starts_at", end).gt("ends_at", start),
      ]);
      if (bookings.error) throw new Error(`Supabase bookings: ${bookings.error.message}`);
      if (blocks.error) throw new Error(`Supabase booking_blocks: ${blocks.error.message}`);
      return [
        ...(bookings.data ?? []).map((r) => ({ start: new Date(r.slot_start), end: new Date(r.slot_end) })),
        ...(blocks.data ?? []).map((r) => ({ start: new Date(r.starts_at), end: new Date(r.ends_at) })),
      ];
    },

    async usage(email, now) {
      const [mine, recent] = await Promise.all([
        client
          .from("bookings")
          .select("id", { count: "exact", head: true })
          .eq("status", "confirmed")
          .eq("email", email)
          .gt("slot_start", now.toISOString()),
        client
          .from("bookings")
          .select("id", { count: "exact", head: true })
          .gt("created_at", new Date(now.getTime() - HOUR_MS).toISOString()),
      ]);
      if (mine.error) throw new Error(`Supabase usage: ${mine.error.message}`);
      if (recent.error) throw new Error(`Supabase usage: ${recent.error.message}`);
      return { upcomingForEmail: mine.count ?? 0, createdLastHour: recent.count ?? 0 };
    },

    async markNotified(id) {
      const { error } = await client.from("bookings").update({ team_notified: true }).eq("id", id);
      if (error) throw new Error(`Supabase update: ${error.message}`);
    },

    async create(booking) {
      const { data, error } = await client
        .from("bookings")
        .insert({
          slot_start: booking.slotStart.toISOString(),
          slot_end: booking.slotEnd.toISOString(),
          name: booking.name,
          email: booking.email,
          company: booking.company,
          phone: booking.phone,
          message: booking.message,
          locale: booking.locale,
        })
        .select("id, created_at")
        .single();
      // 23505 = unique_violation: someone booked this slot a moment earlier.
      if (error?.code === "23505") return { ok: false, reason: "taken" };
      if (error || !data) throw new Error(`Supabase insert: ${error?.message ?? "no row returned"}`);
      return { ok: true, booking: { ...booking, id: data.id as string, createdAt: new Date(data.created_at as string) } };
    },
  };
}

// ── File (development) ─────────────────────────────────────────────────────

interface FileData {
  bookings: {
    id: string;
    slot_start: string;
    slot_end: string;
    name: string;
    email: string;
    company: string | null;
    phone: string | null;
    message: string | null;
    locale: "pt" | "en";
    status: "confirmed" | "cancelled";
    created_at: string;
    team_notified?: boolean;
  }[];
  /** Times the team marks as unavailable: { starts_at, ends_at, reason }. */
  blocks: { starts_at: string; ends_at: string; reason?: string }[];
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const RETRIES = 8;
const transient = (error: unknown) => ["EBUSY", "EPERM", "EACCES"].includes((error as NodeJS.ErrnoException).code ?? "");

// One write queue per file for the whole process — shared by every store
// instance, including the ones a dev-server recompile creates — so two
// requests can't both take the same slot.
const fileLocks: Map<string, Promise<unknown>> = ((
  globalThis as { __neroesBookingLocks?: Map<string, Promise<unknown>> }
).__neroesBookingLocks ??= new Map());

export function createFileStore(file: string): BookingStore {
  const exclusive = <T>(task: () => Promise<T>): Promise<T> => {
    const run = (fileLocks.get(file) ?? Promise.resolve()).then(task, task);
    fileLocks.set(file, run.catch(() => undefined));
    return run;
  };

  // Windows can briefly lock the file while another request swaps it in:
  // such reads are retried instead of failing the request.
  const load = async (): Promise<FileData> => {
    for (let attempt = 0; ; attempt++) {
      let text: string;
      try {
        text = await readFile(file, "utf8");
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") return { bookings: [], blocks: [] };
        if (transient(error) && attempt < RETRIES) {
          await sleep(15 * (attempt + 1));
          continue;
        }
        throw error;
      }
      try {
        const parsed = JSON.parse(text) as Partial<FileData>;
        return { bookings: parsed.bookings ?? [], blocks: parsed.blocks ?? [] };
      } catch {
        if (attempt < RETRIES) {
          await sleep(15 * (attempt + 1));
          continue;
        }
        throw new Error(`Booking file is not valid JSON: ${file}`);
      }
    }
  };

  // Write a temp file, then swap it in: readers get the old or the new
  // content, never half of it.
  const save = async (data: FileData) => {
    await mkdir(path.dirname(file), { recursive: true });
    const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
    await writeFile(tmp, JSON.stringify(data, null, 2) + "\n", "utf8");
    for (let attempt = 0; ; attempt++) {
      try {
        await rename(tmp, file);
        return;
      } catch (error) {
        if (transient(error) && attempt < RETRIES) {
          await sleep(15 * (attempt + 1));
          continue;
        }
        throw error;
      }
    }
  };

  return createDataStore("file", { load, save, exclusive });
}

// ── Memory (demo on Vercel previews) ───────────────────────────────────────

/**
 * Demo store for Vercel preview deployments with no database: bookings live
 * in this server instance's memory (gone on a restart, not shared between
 * instances) and no email goes out. Previews sit behind Vercel's login, so
 * only the team sees them, and the page says it is a demo.
 */
export function createMemoryStore(): BookingStore {
  const state: FileData = ((globalThis as { __neroesDemoBookings?: FileData }).__neroesDemoBookings ??= {
    bookings: [],
    blocks: [],
  });
  let queue: Promise<unknown> = Promise.resolve();
  const exclusive = <T>(task: () => Promise<T>): Promise<T> => {
    const run = queue.then(task, task);
    queue = run.catch(() => undefined);
    return run;
  };
  return createDataStore("memory", {
    load: async () => ({ bookings: state.bookings.map((b) => ({ ...b })), blocks: [...state.blocks] }),
    save: async (data) => {
      state.bookings = data.bookings;
      state.blocks = data.blocks;
    },
    exclusive,
  });
}

// ── Shared by the file and memory stores ──────────────────────────────────

interface DataIO {
  load(): Promise<FileData>;
  save(data: FileData): Promise<void>;
  /** Runs one read-modify-write at a time. */
  exclusive<T>(task: () => Promise<T>): Promise<T>;
}

function createDataStore(kind: "file" | "memory", { load, save, exclusive }: DataIO): BookingStore {
  const overlapsRange = (start: string, end: string, range: Interval) =>
    new Date(start) < range.end && new Date(end) > range.start;

  return {
    kind,

    async busy(range) {
      const data = await load();
      return [
        ...data.bookings
          .filter((b) => b.status === "confirmed" && overlapsRange(b.slot_start, b.slot_end, range))
          .map((b) => ({ start: new Date(b.slot_start), end: new Date(b.slot_end) })),
        ...data.blocks
          .filter((b) => overlapsRange(b.starts_at, b.ends_at, range))
          .map((b) => ({ start: new Date(b.starts_at), end: new Date(b.ends_at) })),
      ];
    },

    async usage(email, now) {
      const data = await load();
      return {
        upcomingForEmail: data.bookings.filter(
          (b) => b.status === "confirmed" && b.email === email && new Date(b.slot_start) > now,
        ).length,
        createdLastHour: data.bookings.filter((b) => now.getTime() - new Date(b.created_at).getTime() < HOUR_MS).length,
      };
    },

    markNotified(id) {
      return exclusive(async () => {
        const data = await load();
        const booking = data.bookings.find((b) => b.id === id);
        if (!booking) return;
        booking.team_notified = true;
        await save(data);
      });
    },

    create(booking) {
      return exclusive(async () => {
        const data = await load();
        const start = booking.slotStart.toISOString();
        if (data.bookings.some((b) => b.status === "confirmed" && b.slot_start === start)) {
          return { ok: false as const, reason: "taken" as const };
        }
        const id = randomUUID();
        const createdAt = new Date();
        data.bookings.push({
          id,
          slot_start: start,
          slot_end: booking.slotEnd.toISOString(),
          name: booking.name,
          email: booking.email,
          company: booking.company,
          phone: booking.phone,
          message: booking.message,
          locale: booking.locale,
          status: "confirmed",
          created_at: createdAt.toISOString(),
          team_notified: false,
        });
        await save(data);
        return { ok: true as const, booking: { ...booking, id, createdAt } };
      });
    },
  };
}

// ── Selection ──────────────────────────────────────────────────────────────

/** Where the file store keeps local bookings unless BOOKING_FILE says otherwise. */
export function defaultBookingFile(): string {
  return path.join(tmpdir(), "neroes-website", "bookings.json");
}

let cached: { key: string; store: BookingStore | null } | null = null;

/** The configured store, or null when online booking is off. */
export function getBookingStore(env: NodeJS.ProcessEnv = process.env): BookingStore | null {
  const mode = env.BOOKING_STORE?.trim().toLowerCase() ?? "";
  const url = env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const key = env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
  const local = env.NODE_ENV !== "production" && !env.VERCEL;
  const preview = env.VERCEL_ENV === "preview";
  const cacheKey = [mode, url, key ? "k" : "", local, preview, env.BOOKING_FILE ?? ""].join("|");
  if (cached?.key === cacheKey) return cached.store;

  let store: BookingStore | null = null;
  if (mode === "supabase") {
    store = url && key ? createSupabaseStore(url, key) : null;
  } else if (mode === "file" || (mode === "" && local)) {
    // Never on Vercel: its file system is read-only and not shared between instances.
    store = env.VERCEL ? null : createFileStore(env.BOOKING_FILE?.trim() || defaultBookingFile());
  } else if (mode === "demo" || (mode === "" && preview)) {
    store = createMemoryStore();
  }
  cached = { key: cacheKey, store };
  return store;
}

/** Same rule as getMailConfig().configured in src/lib/mail.ts. */
function emailConfigured(env: NodeJS.ProcessEnv): boolean {
  return Boolean(env.SMTP_USER?.trim() && env.SMTP_PASS?.replace(/\s+/g, ""));
}

/**
 * The store behind the Contacto agenda, or null when the agenda is off.
 * Online (production/Vercel) it also needs email: without it a booking would be
 * saved with nobody at Neroes being told, and the visitor would wait in vain.
 * BOOKING_ALLOW_WITHOUT_EMAIL=1 lifts that, for trying a preview out only.
 * The demo store needs no email: it books nothing real.
 */
export function getSchedulerStore(env: NodeJS.ProcessEnv = process.env): BookingStore | null {
  const store = getBookingStore(env);
  if (!store) return null;
  const local = env.NODE_ENV !== "production" && !env.VERCEL;
  if (store.kind !== "memory" && !local && !emailConfigured(env) && env.BOOKING_ALLOW_WITHOUT_EMAIL !== "1") return null;
  return store;
}
