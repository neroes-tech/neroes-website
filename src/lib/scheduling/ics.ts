/**
 * Calendar files for a booking: an iCalendar (.ics) event attached to the
 * emails and offered for download, and a Google Calendar "add event" link.
 * No imports, so tests run it under plain Node.
 */

export interface CalendarEvent {
  uid: string;
  start: Date;
  end: Date;
  title: string;
  description: string;
  organizerEmail: string;
  attendee?: { name: string; email: string };
}

/** 20261008T090000Z */
function icsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** RFC 5545 text escaping. */
function escapeText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

/**
 * RFC 5545 parameter value (e.g. CN): quoted, so commas, semicolons and colons
 * are safe. Quotes and control characters can't appear inside one, so they go.
 */
function quoteParam(value: string): string {
  return `"${value.replace(/[\u0000-\u001f\u007f"]/g, "'")}"`;
}

/** RFC 5545 line folding: at most 75 octets per line, continuation lines start with a space. */
function fold(line: string): string {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const out: string[] = [];
  let current = "";
  let size = 0;
  for (const char of line) {
    const charSize = new TextEncoder().encode(char).length;
    const limit = out.length === 0 ? 75 : 74; // continuation lines lose one octet to the leading space
    if (size + charSize > limit) {
      out.push(current);
      current = "";
      size = 0;
    }
    current += char;
    size += charSize;
  }
  out.push(current);
  return out.join("\r\n ");
}

export function buildIcs(event: CalendarEvent, now = new Date()): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Neroes//Agenda//PT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${icsDate(now)}`,
    `DTSTART:${icsDate(event.start)}`,
    `DTEND:${icsDate(event.end)}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(event.description)}`,
    `ORGANIZER;CN=Neroes:mailto:${event.organizerEmail}`,
    ...(event.attendee
      ? [`ATTENDEE;CN=${quoteParam(event.attendee.name)};ROLE=REQ-PARTICIPANT:mailto:${event.attendee.email}`]
      : []),
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}

/** Google Calendar's "create event" page, prefilled. */
export function googleCalendarUrl(event: Pick<CalendarEvent, "start" | "end" | "title" | "description">): string {
  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", event.title);
  url.searchParams.set("dates", `${icsDate(event.start)}/${icsDate(event.end)}`);
  url.searchParams.set("details", event.description);
  return url.toString();
}
