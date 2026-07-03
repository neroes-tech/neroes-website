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
    <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
      <div aria-live="polite" className="mb-6">
        {status === "success" && (
          <div role="status" className="rounded-md border border-green-200 bg-green-50 p-4 font-medium text-green-900">
            {statusMessage}
          </div>
        )}
        {status === "error" && (
          <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-4 font-medium text-red-900">
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
            className="h-12 w-full rounded-md border border-input bg-background px-3 outline-none transition-shadow focus:ring-2 focus:ring-primary"
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
            className="h-12 w-full rounded-md border border-input bg-background px-3 outline-none transition-shadow focus:ring-2 focus:ring-primary"
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
            className="h-12 w-full rounded-md border border-input bg-background px-3 outline-none transition-shadow focus:ring-2 focus:ring-primary"
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
            className="w-full resize-y rounded-md border border-input bg-background p-3 outline-none transition-shadow focus:ring-2 focus:ring-primary"
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
              className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
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
          className="h-12 w-full bg-primary text-lg transition-colors hover:bg-primary/90"
        >
          {status === "submitting" ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
}
