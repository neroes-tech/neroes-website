"use client";

import Link from "next/link";
import { forwardRef, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Slot } from "@/lib/scheduling/availability";
import { LIMITS, validateBooking, type BookingField, type FieldError } from "@/lib/scheduling/validate";
import { CONTACT_INFO } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

import { fill, formatDayLong, formatTime, formatVisitorTime } from "./format";

export interface BookedResult {
  /** The booking's id — also the calendar event's UID, as in the emails. */
  id: string;
  /** The booked day ("YYYY-MM-DD", Lisbon). */
  date: string;
  start: string;
  end: string;
  name: string;
  email: string;
  emailSent: boolean;
}

export type BookingFields = {
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
  consent: boolean;
  /** Honeypot (sent to the API as "website"). */
  website: string;
};

export const EMPTY_FIELDS: BookingFields = { name: "", email: "", company: "", phone: "", message: "", consent: false, website: "" };

interface Props {
  slot: Slot;
  date: string;
  timeZone: string;
  /** The visitor's own time zone, when it isn't Lisbon's. */
  visitorTimeZone: string | null;
  /** Kept by the parent, so nothing typed is lost if the time has to change. */
  fields: BookingFields;
  onFieldsChange: (update: (prev: BookingFields) => BookingFields) => void;
  onBack: () => void;
  onBooked: (result: BookedResult) => void;
  onSlotLost: (reason: "taken" | "unavailable") => void;
}

type Fields = BookingFields;
const FIELD_ORDER: BookingField[] = ["name", "email", "company", "phone", "message", "consent"];

const inputClass = (invalid: boolean) =>
  cn(
    "block w-full rounded-xl border bg-background px-3.5 text-[0.95rem] text-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
    invalid ? "border-destructive" : "border-foreground/45 hover:border-foreground/70",
  );

/**
 * The visitor's details for the chosen time. Validated here for instant
 * feedback and again by the API, which also re-checks that the time is still
 * free. Errors are listed at the top (announced) and next to each field;
 * focus moves to the first one.
 */
export const BookingForm = forwardRef<HTMLHeadingElement, Props>(function BookingForm(
  { slot, date, timeZone, visitorTimeZone, fields, onFieldsChange, onBack, onBooked, onSlotLost },
  headingRef,
) {
  const { t, locale } = useLanguage();
  const s = t.contact.scheduler;
  const f = s.form;
  const [errors, setErrors] = useState<Partial<Record<BookingField, FieldError>>>({});
  const [formError, setFormError] = useState<ReactNode>(null);
  const [submitting, setSubmitting] = useState(false);
  const refs = useRef(new Map<BookingField, HTMLInputElement | HTMLTextAreaElement>());

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    onFieldsChange((prev) => ({ ...prev, [key]: value }));
    if (key in errors) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const message = (field: BookingField, error: FieldError | undefined): string | null => {
    if (!error) return null;
    if (error === "tooLong") return s.errors.tooLong;
    if (field === "consent") return s.errors.consent;
    if (field === "name") return s.errors.name;
    if (field === "email") return error === "required" ? s.errors.required : s.errors.email;
    if (field === "phone") return s.errors.phone;
    return s.errors.required;
  };

  const focusFirst = (errs: Partial<Record<BookingField, FieldError>>) => {
    const first = FIELD_ORDER.find((field) => errs[field]);
    if (first) refs.current.get(first)?.focus();
  };

  const generic = (
    <>
      {s.errors.generic}{" "}
      <a href={`mailto:${CONTACT_INFO.email}`} className="font-medium underline underline-offset-2">
        {CONTACT_INFO.email}
      </a>
      .
    </>
  );

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setFormError(null);
    const payload = { ...fields, slotStart: slot.start, locale };
    const check = validateBooking(payload);
    if (!check.ok) {
      setErrors(check.errors);
      setFormError(s.errors.summary);
      focusFirst(check.errors);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json().catch(() => ({}))) as {
        error?: string;
        fields?: Partial<Record<BookingField, FieldError>>;
        booking?: { id: string } | null;
        email?: { visitor?: boolean };
      };
      // A 201 without a booking is the honeypot's decoy answer: a person
      // only gets it if something filled the hidden field, so say it failed.
      if (response.status === 201 && body.booking?.id) {
        onBooked({
          id: body.booking.id,
          date,
          start: slot.start,
          end: slot.end,
          name: check.data.name,
          email: check.data.email,
          emailSent: Boolean(body.email?.visitor),
        });
        return;
      }
      if (response.status === 409) return onSlotLost("taken");
      if (response.status === 422) return onSlotLost("unavailable");
      if (response.status === 400 && body.fields) {
        setErrors(body.fields);
        setFormError(s.errors.summary);
        focusFirst(body.fields);
        return;
      }
      setFormError(
        response.status === 429 ? (body.error === "email_limit" ? s.errors.emailLimit : s.errors.rate) : generic,
      );
    } catch {
      setFormError(generic);
    } finally {
      setSubmitting(false);
    }
  };

  const field = (
    name: Exclude<BookingField, "slotStart" | "consent">,
    label: string,
    options: { type?: string; autoComplete?: string; required?: boolean; multiline?: boolean; maxLength: number },
  ) => {
    const id = `booking-${name}`;
    const error = message(name, errors[name]);
    const describedBy = error ? `${id}-error` : undefined;
    const common = {
      id,
      name,
      value: fields[name],
      maxLength: options.maxLength,
      required: options.required,
      "aria-invalid": error ? true : undefined,
      "aria-describedby": describedBy,
    };
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-bold text-foreground">
          {label}
          {options.required ? (
            <span aria-hidden="true" className="text-destructive">
              {" "}
              *
            </span>
          ) : (
            <span className="font-normal text-muted-foreground"> ({f.optional})</span>
          )}
        </label>
        {options.multiline ? (
          <textarea
            {...common}
            ref={(el) => {
              if (el) refs.current.set(name, el);
            }}
            rows={3}
            onChange={(e) => set(name, e.target.value)}
            className={cn(inputClass(Boolean(error)), "mt-1.5 min-h-24 resize-y py-2.5")}
          />
        ) : (
          <input
            {...common}
            ref={(el) => {
              if (el) refs.current.set(name, el);
            }}
            type={options.type ?? "text"}
            autoComplete={options.autoComplete}
            onChange={(e) => set(name, e.target.value)}
            className={cn(inputClass(Boolean(error)), "mt-1.5 h-11")}
          />
        )}
        {error && (
          <p id={`${id}-error`} className="mt-1.5 text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  };

  const start = formatTime(slot.start, timeZone, locale);
  const end = formatTime(slot.end, timeZone, locale);
  const consentError = message("consent", errors.consent);

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="-ml-2 inline-flex h-10 items-center gap-1.5 rounded-full px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {f.change}
      </button>

      <h3 ref={headingRef} tabIndex={-1} className="mt-2 font-exo text-xl font-bold tracking-[-0.02em] text-foreground focus:outline-none">
        {f.heading}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        <span className="font-bold text-foreground">
          {formatDayLong(date, locale)}, {start}–{end}
        </span>{" "}
        · {s.lisbonTime}
        {visitorTimeZone && <> · {fill(s.yourTime, { time: formatVisitorTime(slot.start, visitorTimeZone, date, locale) })}</>}
      </p>

      <div aria-live="assertive">
        {formError && (
          <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/[0.06] px-4 py-3 text-sm text-destructive">
            {formError}
          </p>
        )}
      </div>

      <form noValidate onSubmit={onSubmit} className="mt-5 space-y-4">
        {field("name", f.name, { autoComplete: "name", required: true, maxLength: LIMITS.name })}
        {field("email", f.email, { type: "email", autoComplete: "email", required: true, maxLength: LIMITS.email })}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {field("company", f.company, { autoComplete: "organization", maxLength: LIMITS.company })}
          {field("phone", f.phone, { type: "tel", autoComplete: "tel", maxLength: LIMITS.phone })}
        </div>
        {field("message", f.message, { multiline: true, maxLength: LIMITS.message })}

        {/* Honeypot: off-screen and out of the tab order; people never fill it.
            A meaningless name and the password managers' ignore flags keep
            autofill out of it too. */}
        <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
          <label htmlFor="nr_hp_x">{f.honeypot}</label>
          <input
            id="nr_hp_x"
            name="nr_hp_x"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            data-1p-ignore=""
            data-lpignore="true"
            data-bwignore=""
            data-form-type="other"
            value={fields.website}
            onChange={(e) => set("website", e.target.value)}
          />
        </div>

        <div>
          <div className="flex items-start gap-3">
            <input
              ref={(el) => {
                if (el) refs.current.set("consent", el);
              }}
              id="booking-consent"
              name="consent"
              type="checkbox"
              checked={fields.consent}
              onChange={(e) => set("consent", e.target.checked)}
              aria-invalid={consentError ? true : undefined}
              aria-describedby={consentError ? "booking-consent-error" : undefined}
              required
              className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-secondary"
            />
            <label htmlFor="booking-consent" className="text-sm leading-relaxed text-foreground">
              {f.consentBefore}{" "}
              {/* New tab, so leaving to read it doesn't lose the booking. */}
              <Link
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-secondary underline underline-offset-2"
              >
                {f.consentLink}
                <span className="sr-only"> {f.newTab}</span>
              </Link>
              .
              <span aria-hidden="true" className="text-destructive">
                {" "}
                *
              </span>
            </label>
          </div>
          {consentError && (
            <p id="booking-consent-error" className="mt-1.5 text-sm text-destructive">
              {consentError}
            </p>
          )}
        </div>

        {/* aria-disabled, not disabled: focus stays on the button while sending. */}
        <Button type="submit" size="lg" className="w-full aria-disabled:opacity-60 sm:w-auto" aria-disabled={submitting}>
          {submitting ? f.submitting : f.submit}
        </Button>
      </form>
    </div>
  );
});
