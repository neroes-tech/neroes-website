import { NextResponse, type NextRequest } from "next/server";

import { sendBookingEmails } from "@/lib/mail";
import { checkSlot, dateKeyInZone, SCHEDULE, utcRangeForDays } from "@/lib/scheduling/availability";
import { getSchedulerStore } from "@/lib/scheduling/store";
import { validateBooking } from "@/lib/scheduling/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };
const MAX_BODY_BYTES = 10_000;

// Limits kept in the database, so they hold across server instances: one
// email can hold at most 2 upcoming bookings, and the whole site takes at most
// 12 bookings an hour (far above real demand, far below filling the calendar).
const MAX_UPCOMING_PER_EMAIL = 2;
const MAX_BOOKINGS_PER_HOUR = 12;

// Plus a quick per-address brake on repeated requests (per server instance).
const RATE_LIMIT = { max: 5, windowMs: 10 * 60_000 };
const attempts = new Map<string, number[]>();

function rateLimited(ip: string, now: number): boolean {
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  if (recent.length >= RATE_LIMIT.max) {
    attempts.set(ip, recent);
    return true;
  }
  recent.push(now);
  attempts.set(ip, recent);
  if (attempts.size > 5000) {
    for (const [key, times] of attempts) if (times.every((t) => now - t >= RATE_LIMIT.windowMs)) attempts.delete(key);
  }
  return false;
}

const json = (body: unknown, status: number) => NextResponse.json(body, { status, headers: NO_STORE });

/**
 * POST /api/bookings — books one free slot. Everything the form checks is
 * checked again here (the request may not come from the form): the fields,
 * that the slot exists in the schedule and is far enough ahead, and that it is
 * still free. Then the team and the visitor get an email.
 */
export async function POST(request: NextRequest) {
  const store = getSchedulerStore();
  if (!store) return json({ error: "disabled" }, 503);

  // Only this site's own page may book. A JSON body can't be sent
  // cross-site without a CORS preflight (which this route never grants), and
  // browsers flag cross-site requests in Sec-Fetch-Site.
  if (!(request.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) {
    return json({ error: "content_type" }, 415);
  }
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") return json({ error: "forbidden" }, 403);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
  if (rateLimited(ip, Date.now())) return json({ error: "rate" }, 429);

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json({ error: "too_large" }, 413);
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "bad_json" }, 400);
  }

  const result = validateBooking(body);
  if (!result.ok) return json({ error: "validation", fields: result.errors }, 400);
  const input = result.data;

  // Honeypot filled in: answer like a success, book nothing.
  if (input.website) return json({ ok: true, booking: null, email: { configured: false, visitor: false } }, 201);

  try {
    const now = new Date();
    const requested = new Date(input.slotStart);
    const day = dateKeyInZone(requested, SCHEDULE.timeZone);
    const busy = await store.busy(utcRangeForDays(day, day));
    const check = checkSlot(input.slotStart, now, busy);
    if (!check.ok) return json({ error: check.reason === "taken" ? "taken" : "unavailable" }, check.reason === "taken" ? 409 : 422);

    const usage = await store.usage(input.email, now);
    if (usage.upcomingForEmail >= MAX_UPCOMING_PER_EMAIL) return json({ error: "email_limit" }, 429);
    if (usage.createdLastHour >= MAX_BOOKINGS_PER_HOUR) return json({ error: "rate" }, 429);

    const created = await store.create({
      slotStart: new Date(check.slot.start),
      slotEnd: new Date(check.slot.end),
      name: input.name,
      email: input.email,
      company: input.company || null,
      phone: input.phone || null,
      message: input.message || null,
      locale: input.locale,
    });
    if (!created.ok) return json({ error: "taken" }, 409);

    // The preview demo books nothing real, so it emails nobody.
    const email =
      store.kind === "memory"
        ? { configured: false, team: false, visitor: false }
        : await sendBookingEmails(created.booking);
    // Bookings whose team email failed stay team_notified = false, so they
    // can be found and followed up (docs/sql/bookings.sql).
    if (email.team) {
      await store.markNotified(created.booking.id).catch((error: unknown) => console.error("[bookings] markNotified", error));
    } else if (store.kind !== "memory") {
      console.error(`[bookings] team NOT notified of booking ${created.booking.id} (email ${email.configured ? "failed" : "not configured"})`);
    }
    return json(
      {
        ok: true,
        booking: { id: created.booking.id, start: check.slot.start, end: check.slot.end },
        email: { configured: email.configured, visitor: email.visitor },
      },
      201,
    );
  } catch (error) {
    console.error("[bookings]", error);
    return json({ error: "unavailable_store" }, 503);
  }
}
