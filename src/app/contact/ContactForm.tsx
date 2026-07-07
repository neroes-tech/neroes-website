"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().optional(),
  gdpr: z.boolean().refine((val) => val === true, "You must accept the privacy policy"),
});

type FormValues = z.infer<typeof formSchema>;

const inputClasses =
  "w-full rounded-xl border border-input bg-background px-4 outline-none transition-shadow focus:border-ring focus:ring-2 focus:ring-ring/30";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", message: "", gdpr: false },
  });

  const onSubmit = async (values: FormValues) => {
    setStatus("submitting");
    setStatusMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone || undefined,
          message: values.message || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Unexpected error");
      setStatus("success");
      setStatusMessage(
        "Thank you. Your message has been sent successfully. We will get back to you shortly.",
      );
      form.reset();
    } catch (err) {
      setStatus("error");
      setStatusMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again or email us directly at info@neroes.tech.",
      );
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-10">
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
          <div
            role="alert"
            className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 font-medium text-destructive"
          >
            {statusMessage}
          </div>
        )}
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Name *
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
            Email *
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
            Phone
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
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            {...form.register("message")}
            className={`resize-y py-3 ${inputClasses}`}
          />
        </div>

        <fieldset className="mt-6 border-t border-border pt-6">
          <legend className="sr-only">Privacy Policy Agreement</legend>
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
              I agree to the processing of my personal data as described in the{" "}
              <a href="/privacy-policy" className="text-secondary hover:underline">
                Privacy Policy
              </a>
              . *
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
          className="h-12 w-full rounded-full bg-secondary text-base font-semibold text-secondary-foreground transition-shadow hover:bg-secondary/90 hover:shadow-glow-secondary"
        >
          {status === "submitting" ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
}
