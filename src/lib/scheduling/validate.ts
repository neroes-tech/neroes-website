/**
 * Validation of a booking request, shared by the API (the authority) and the
 * form (instant feedback). No imports, so tests run it under plain Node.
 */

export type Locale = "pt" | "en";

export interface BookingRequest {
  slotStart: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
  consent: boolean;
  locale: Locale;
  /** Honeypot: hidden from people, filled in by naive bots. */
  website: string;
}

export type BookingField = "slotStart" | "name" | "email" | "company" | "phone" | "message" | "consent";
export type FieldError = "required" | "invalid" | "tooLong";

export const LIMITS = { name: 100, email: 254, company: 120, phone: 40, message: 1000 } as const;

// Pragmatic address check: something@something.tld, no spaces. The real test
// is the confirmation email arriving.
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;
// Digits with the usual separators and an optional leading +; 7–15 digits.
const PHONE_RE = /^\+?[\d\s().-]+$/;

function text(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function multiline(value: unknown): string {
  return typeof value === "string" ? value.replace(/\r\n?/g, "\n").trim() : "";
}

export function validateBooking(
  input: unknown,
): { ok: true; data: BookingRequest } | { ok: false; errors: Partial<Record<BookingField, FieldError>> } {
  const raw = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const data: BookingRequest = {
    slotStart: text(raw.slotStart),
    name: text(raw.name),
    email: text(raw.email).toLowerCase(),
    company: text(raw.company),
    phone: text(raw.phone),
    message: multiline(raw.message),
    consent: raw.consent === true,
    locale: raw.locale === "en" ? "en" : "pt",
    website: text(raw.website),
  };

  const errors: Partial<Record<BookingField, FieldError>> = {};
  if (!data.slotStart || Number.isNaN(Date.parse(data.slotStart))) errors.slotStart = "required";

  if (!data.name) errors.name = "required";
  else if (data.name.length > LIMITS.name) errors.name = "tooLong";
  else if (data.name.length < 2) errors.name = "invalid";

  if (!data.email) errors.email = "required";
  else if (data.email.length > LIMITS.email) errors.email = "tooLong";
  else if (!EMAIL_RE.test(data.email)) errors.email = "invalid";

  if (data.company.length > LIMITS.company) errors.company = "tooLong";

  if (data.phone) {
    const digits = data.phone.replace(/\D/g, "").length;
    if (data.phone.length > LIMITS.phone) errors.phone = "tooLong";
    else if (!PHONE_RE.test(data.phone) || digits < 7 || digits > 15) errors.phone = "invalid";
  }

  if (data.message.length > LIMITS.message) errors.message = "tooLong";
  if (!data.consent) errors.consent = "required";

  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, data };
}
