/**
 * The booking calendar on the Contacto page: a Google Calendar appointment
 * schedule (chosen on 6 Oct 2026) or a Calendly event, embedded as a plain
 * iframe. Both show the free days and times from the team's real calendar,
 * take the booking and send the confirmation emails — the site stores nothing.
 */
export type BookingProvider = "google" | "calendly";

export interface Booking {
  provider: BookingProvider;
  /** The public booking page, for the "open in a new window" link. */
  url: string;
}

// Google's "Website embed" code points at
// calendar.google.com/calendar/appointments/schedules/<id> (sometimes with a
// /u/<n>/ account segment). Short calendar.app.google links only redirect
// there, so they cannot be embedded.
const GOOGLE_SCHEDULE_PATH = /^\/calendar(?:\/u\/\d+)?\/appointments\/schedules\/[\w-]+\/?$/;

/**
 * Reads the configured booking link. Accepts the page URL or the whole
 * <iframe> snippet Google's "Website embed" dialog copies (its src is used).
 * Anything that isn't an https Google appointment schedule or Calendly link
 * gives null, and the page falls back to email and phone.
 */
export function parseBookingUrl(raw: string | undefined): Booking | null {
  let value = raw?.trim();
  if (!value) return null;
  const src = /\bsrc\s*=\s*["']([^"']+)["']/i.exec(value);
  if (src) value = src[1]!;
  value = value.replace(/&amp;/g, "&");

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;

  if (url.hostname === "calendar.google.com" && GOOGLE_SCHEDULE_PATH.test(url.pathname)) {
    // The public page; gv=true (embed mode) is added by the embed itself.
    url.searchParams.delete("gv");
    url.hash = "";
    return { provider: "google", url: url.toString() };
  }
  if (url.hostname === "calendly.com" || url.hostname.endsWith(".calendly.com")) {
    return { provider: "calendly", url: url.toString() };
  }
  return null;
}

/**
 * The iframe src for a booking page. Google: embed mode (gv=true, its own
 * website-embed code) in the page language. Calendly: its documented inline
 * parameters; embed_domain needs the real host, so call this after mount.
 */
export function bookingEmbedSrc(booking: Booking, options: { locale: "pt" | "en"; host: string }): string {
  const url = new URL(booking.url);
  if (booking.provider === "google") {
    url.searchParams.set("gv", "true");
    url.searchParams.set("hl", options.locale === "pt" ? "pt-PT" : "en");
  } else {
    url.searchParams.set("embed_type", "Inline");
    url.searchParams.set("embed_domain", options.host);
  }
  return url.toString();
}
