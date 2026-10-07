import { NextResponse, type NextRequest } from "next/server";

import { SCHEDULE, bookingWindow, buildDays, monthRange, utcRangeForDays } from "@/lib/scheduling/availability";
import { getSchedulerStore } from "@/lib/scheduling/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

/**
 * GET /api/availability?month=YYYY-MM — every day of the month with its
 * status (available / busy / closed) and slots (free / busy / past), in Lisbon
 * time. Carries no personal data: only which times are taken.
 */
export async function GET(request: NextRequest) {
  const store = getSchedulerStore();
  if (!store) return NextResponse.json({ error: "disabled" }, { status: 503, headers: NO_STORE });

  const now = new Date();
  const { today, last } = bookingWindow(now);
  const minMonth = today.slice(0, 7);
  const maxMonth = last.slice(0, 7);
  const month = request.nextUrl.searchParams.get("month") ?? minMonth;
  if (!/^\d{4}-\d{2}$/.test(month) || month < minMonth || month > maxMonth) {
    return NextResponse.json({ error: "month", minMonth, maxMonth }, { status: 400, headers: NO_STORE });
  }

  const { from, to } = monthRange(month);
  // Only the bookable part of the month needs the store.
  const queryFrom = from < today ? today : from;
  const queryTo = to > last ? last : to;
  try {
    const busy = queryFrom <= queryTo ? await store.busy(utcRangeForDays(queryFrom, queryTo)) : [];
    return NextResponse.json(
      {
        timeZone: SCHEDULE.timeZone,
        slotMinutes: SCHEDULE.slotMinutes,
        month,
        minMonth,
        maxMonth,
        today,
        days: buildDays(from, to, now, busy),
      },
      { headers: NO_STORE },
    );
  } catch (error) {
    console.error("[availability]", error);
    return NextResponse.json({ error: "unavailable" }, { status: 503, headers: NO_STORE });
  }
}
