"use client";

import Image from "next/image";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { TESTIMONIALS } from "@/lib/constants";

/**
 * Real client quotes, all visible at once — no carousel to operate, no
 * decorative star ratings (nobody gave those stars).
 */
export function ClientTestimonials() {
  const { t } = useLanguage();

  return (
    <section aria-labelledby="client-testimonials-heading" className="border-t border-border bg-background py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading id="client-testimonials-heading" title={t.shared.clientsLoveHeading} />
        <ul className="grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <li key={testimonial.name} className="border-t border-foreground/15 pt-6">
              <figure className="flex h-full flex-col">
                <blockquote lang="en" className="text-lg leading-relaxed text-foreground">
                  “{testimonial.content}”
                </blockquote>
                <figcaption className="mt-6 flex items-end justify-between gap-4">
                  <span>
                    <span className="block font-bold text-foreground">{testimonial.name}</span>
                    <span className="block text-sm text-muted-foreground">{testimonial.role}</span>
                  </span>
                  {testimonial.companyLogo ? (
                    <Image
                      src={testimonial.companyLogo}
                      alt={testimonial.company ?? ""}
                      width={100}
                      height={40}
                      className="h-8 w-auto object-contain"
                    />
                  ) : testimonial.company ? (
                    <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {testimonial.company}
                    </span>
                  ) : null}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
