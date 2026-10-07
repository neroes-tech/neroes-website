import nodemailer from "nodemailer";

import { CONTACT_INFO } from "@/lib/constants";
import { SCHEDULE } from "@/lib/scheduling/availability";
import { buildIcs } from "@/lib/scheduling/ics";
import type { StoredBooking } from "@/lib/scheduling/store";

/**
 * Email for bookings. Server-only. The neroes.tech mailboxes are on Google
 * Workspace, so the defaults point there: only SMTP_USER (a neroes.tech
 * account) and SMTP_PASS (an app password for it) are required; any other
 * provider works by also setting SMTP_HOST / SMTP_PORT. Without them the
 * booking is still saved — the API just reports that no email went out.
 */
export function getMailConfig(env: NodeJS.ProcessEnv = process.env) {
  const user = env.SMTP_USER?.trim();
  // Google shows app passwords in groups of four ("abcd efgh ijkl mnop").
  const pass = env.SMTP_PASS?.replace(/\s+/g, "");
  const host = env.SMTP_HOST?.trim() || "smtp.gmail.com";
  const port = Number(env.SMTP_PORT?.trim() || 465);
  const to = env.CONTACT_TO_EMAIL?.trim() || CONTACT_INFO.email;
  return { host, port, user, pass, to, configured: Boolean(user && pass) };
}

export type MailConfig = ReturnType<typeof getMailConfig>;

export function createMailTransport(config: MailConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: { user: config.user, pass: config.pass },
    // Fail fast instead of holding the request open until the platform's
    // function timeout.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Plain text → minimal HTML (escaped, line breaks kept). */
const toHtml = (text: string) =>
  `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#0a0a0a">${text
    .split("\n\n")
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
    .join("")}</div>`;

function when(booking: StoredBooking, locale: "pt" | "en") {
  const tag = locale === "pt" ? "pt-PT" : "en-GB";
  const date = new Intl.DateTimeFormat(tag, {
    timeZone: SCHEDULE.timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(booking.slotStart);
  const time = (d: Date) =>
    new Intl.DateTimeFormat(tag, { timeZone: SCHEDULE.timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(d);
  return { date, start: time(booking.slotStart), end: time(booking.slotEnd) };
}

export interface BookingMailResult {
  configured: boolean;
  team: boolean;
  visitor: boolean;
}

/**
 * Tells the team about a new booking (reply goes straight to the visitor) and
 * confirms it to the visitor in their language (reply goes to the team). Both
 * carry the event as an .ics invite. Never throws: a failed email must not undo
 * a booking that is already saved.
 */
export async function sendBookingEmails(booking: StoredBooking): Promise<BookingMailResult> {
  const config = getMailConfig();
  if (!config.configured) return { configured: false, team: false, visitor: false };

  const transport = createMailTransport(config);
  const pt = when(booking, "pt");
  const visitorWhen = when(booking, booking.locale);
  const from = `"Neroes" <${config.user}>`;

  const ics = buildIcs({
    uid: `${booking.id}@neroes.tech`,
    start: booking.slotStart,
    end: booking.slotEnd,
    title: booking.locale === "pt" ? "Conversa com a Neroes" : "Conversation with Neroes",
    description:
      booking.locale === "pt"
        ? `Conversa com a Neroes sobre a plataforma. Contacto: ${config.to} · ${CONTACT_INFO.phone}`
        : `Conversation with Neroes about the platform. Contact: ${config.to} · ${CONTACT_INFO.phone}`,
    organizerEmail: config.to,
    attendee: { name: booking.name, email: booking.email },
  });
  const attachment = { filename: "neroes.ics", content: ics, contentType: "text/calendar; charset=utf-8; method=PUBLISH" };

  const teamText = [
    "Nova marcação pelo site.",
    `Quando: ${pt.date}, ${pt.start}–${pt.end} (hora de Lisboa)`,
    [
      `Nome: ${booking.name}`,
      `Email: ${booking.email}`,
      `Empresa: ${booking.company ?? "—"}`,
      `Telefone: ${booking.phone ?? "—"}`,
      `Idioma: ${booking.locale === "pt" ? "português" : "inglês"}`,
    ].join("\n"),
    `Mensagem:\n${booking.message ?? "—"}`,
    `Responder a este email responde diretamente a ${booking.name}.`,
  ].join("\n\n");

  const visitorText =
    booking.locale === "pt"
      ? [
          `Olá ${booking.name},`,
          `A tua conversa com a Neroes está marcada para ${visitorWhen.date}, às ${visitorWhen.start} (hora de Lisboa).`,
          "Em anexo vai o convite para o teu calendário. Se precisares de mudar a hora ou cancelar, responde a este email.",
          `Neroes\n${config.to} · ${CONTACT_INFO.phone}`,
        ].join("\n\n")
      : [
          `Hi ${booking.name},`,
          `Your conversation with Neroes is booked for ${visitorWhen.date}, at ${visitorWhen.start} (Lisbon time).`,
          "The calendar invite is attached. If you need to change the time or cancel, just reply to this email.",
          `Neroes\n${config.to} · ${CONTACT_INFO.phone}`,
        ].join("\n\n");

  const [team, visitor] = await Promise.allSettled([
    transport.sendMail({
      from,
      to: config.to,
      replyTo: { name: booking.name, address: booking.email },
      subject: `Nova marcação: ${booking.name} — ${pt.date}, ${pt.start}`,
      text: teamText,
      html: toHtml(teamText),
      attachments: [attachment],
    }),
    transport.sendMail({
      from,
      to: { name: booking.name, address: booking.email },
      replyTo: config.to,
      subject:
        booking.locale === "pt"
          ? `Marcação confirmada — Neroes, ${visitorWhen.date}, ${visitorWhen.start}`
          : `Booking confirmed — Neroes, ${visitorWhen.date}, ${visitorWhen.start}`,
      text: visitorText,
      html: toHtml(visitorText),
      attachments: [attachment],
    }),
  ]);
  for (const [who, result] of [["team", team], ["visitor", visitor]] as const) {
    if (result.status === "rejected") console.error(`[booking ${booking.id}] ${who} email failed:`, result.reason);
  }
  transport.close();
  return { configured: true, team: team.status === "fulfilled", visitor: visitor.status === "fulfilled" };
}
