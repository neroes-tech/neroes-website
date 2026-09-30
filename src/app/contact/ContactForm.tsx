"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { CONTACT_INFO } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

/** mailto: link to the company with the visitor's message filled in — the fallback when sending fails. */
function mailtoHref(subject: string, values: { name: string; email: string; phone?: string; message?: string }) {
  const body = [
    `Nome / Name: ${values.name}`,
    `Email: ${values.email}`,
    values.phone ? `Telefone / Phone: ${values.phone}` : null,
    "",
    // Some mail apps cut long mailto: links; the message is kept under ~1500 characters.
    (values.message ?? "").slice(0, 1500),
  ]
    .filter((line) => line !== null)
    .join("\r\n");
  return `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const inputClasses =
  "w-full rounded-xl border border-input bg-background px-4 outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30";

export function ContactForm() {
  const { t, locale } = useLanguage();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  // What the visitor sent last, for the email fallback if delivery fails.
  const [lastValues, setLastValues] = useState<{ name: string; email: string; phone?: string; message?: string } | null>(
    null,
  );
  // Honeypot — see the hidden "website" field below.
  const [website, setWebsite] = useState("");

  const formSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, t.contact.form.nameError),
        email: z.string().email(t.contact.form.emailError),
        phone: z.string().optional(),
        message: z.string().optional(),
        gdpr: z.boolean().refine((val) => val === true, t.contact.form.gdprError),
      }),
    [t],
  );

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", message: "", gdpr: false },
  });

  const onSubmit = async (values: FormValues) => {
    setStatus("submitting");
    setStatusMessage("");
    setLastValues({ name: values.name, email: values.email, phone: values.phone, message: values.message });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone || undefined,
          message: values.message || undefined,
          locale,
          website: website || undefined,
        }),
      });
      if (!res.ok) throw new Error(`Contact API responded ${res.status}`);
      setStatus("success");
      setStatusMessage(t.contact.form.successMessage);
      form.reset();
    } catch (err) {
      // Network down, a server error or a non-JSON error page: the visitor
      // always gets the same localized message with the direct email —
      // never a raw technical error.
      console.warn("[ContactForm] submission failed:", err);
      setStatus("error");
      setStatusMessage(t.contact.form.errorFallback);
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-6 md:p-10">
      <div aria-live="polite" className="mb-6">
        {status === "success" && (
          <div
            role="status"
            className="rounded-xl border border-secondary/40 bg-secondary/10 p-4 font-medium text-secondary"
          >
            {statusMessage}
          </div>
        )}
        {status === "error" && (
          <div role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-destructive">
            <p className="font-medium">{statusMessage}</p>
            {lastValues && (
              <a
                href={mailtoHref(t.contact.form.mailtoSubject, lastValues)}
                className="mt-3 inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
              >
                {t.contact.form.mailtoButton}
              </a>
            )}
          </div>
        )}
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="relative space-y-6" noValidate>
        {/* Honeypot: invisible to people and assistive technology; bots that
            fill every field reveal themselves and the server drops the message. */}
        <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            {t.contact.form.nameLabel}
          </label>
          <input
            id="name"
            aria-required="true"
            aria-invalid={!!form.formState.errors.name}
            aria-describedby={form.formState.errors.name ? "name-error" : undefined}
            {...form.register("name")}
            className={`h-12 ${inputClasses}`}
          />
          {form.formState.errors.name && (
            <p id="name-error" className="text-sm text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            {t.contact.form.emailLabel}
          </label>
          <input
            id="email"
            type="email"
            aria-required="true"
            aria-invalid={!!form.formState.errors.email}
            aria-describedby={form.formState.errors.email ? "email-error" : undefined}
            {...form.register("email")}
            className={`h-12 ${inputClasses}`}
          />
          {form.formState.errors.email && (
            <p id="email-error" className="text-sm text-destructive">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-foreground">
            {t.contact.form.phoneLabel}
          </label>
          <input
            id="phone"
            type="tel"
            {...form.register("phone")}
            className={`h-12 ${inputClasses}`}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium text-foreground">
            {t.contact.form.messageLabel}
          </label>
          <textarea
            id="message"
            rows={4}
            {...form.register("message")}
            className={`resize-y py-3 ${inputClasses}`}
          />
        </div>

        <fieldset className="mt-6 border-t border-border pt-6">
          <legend className="sr-only">{t.contact.form.gdprLink}</legend>
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="gdpr"
              aria-required="true"
              aria-invalid={!!form.formState.errors.gdpr}
              aria-describedby={form.formState.errors.gdpr ? "gdpr-error" : undefined}
              {...form.register("gdpr")}
              className="mt-0.5 h-6 w-6 shrink-0 rounded-md border-input accent-primary"
            />
            <label htmlFor="gdpr" className="text-sm leading-relaxed text-muted-foreground">
              {t.contact.form.gdprPrefix}
              <a href="/privacy-policy" className="text-secondary hover:underline">
                {t.contact.form.gdprLink}
              </a>
              {t.contact.form.gdprSuffix}
            </label>
          </div>
          {form.formState.errors.gdpr && (
            <p id="gdpr-error" className="mt-2 text-sm text-destructive">
              {form.formState.errors.gdpr.message}
            </p>
          )}
        </fieldset>

        <Button
          type="submit"
          disabled={status === "submitting"}
          className="h-12 w-full rounded-full bg-primary text-base font-medium text-primary-foreground transition-colors hover:bg-primary/80"
        >
          {status === "submitting" ? t.contact.form.submittingLabel : t.contact.form.submitLabel}
        </Button>
      </form>
    </div>
  );
}
