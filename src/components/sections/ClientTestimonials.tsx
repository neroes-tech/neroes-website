"use client";

import { Marquee } from "@/components/motion/Marquee";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

/**
 * Every client and athlete quote from the old site — word for word in
 * English, faithfully translated in Portuguese — as one slow strip of white
 * cards on the stone tint that slides sideways. Pointing at it (or focusing
 * inside it) stops it so a quote can be read; the visible button pauses it
 * outright (WCAG 2.2.2). No star ratings nobody gave. "dark" sets the strip
 * over the Home's star field: translucent cards, white type.
 */
export function ClientTestimonials({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const { t } = useLanguage();
  const shared = t.shared;

  return (
    <section aria-labelledby="client-testimonials-heading" className={dark ? "py-20 md:py-28" : "bg-muted py-20 md:py-28"}>
      <div className="container mx-auto px-4 md:px-6">
        <h2
          id="client-testimonials-heading"
          className={`mx-auto max-w-4xl text-center font-exo text-4xl font-light leading-[1.05] tracking-[-0.035em] md:text-6xl ${dark ? "text-white" : "text-foreground"}`}
        >
          {shared.clientsLoveHeading}
        </h2>
      </div>
      <Marquee
        className="mt-14 md:mt-20"
        durationSeconds={95}
        tone={tone}
        pauseLabel={shared.testimonialsPause}
        playLabel={shared.testimonialsPlay}
        items={shared.testimonials.map((testimonial) => (
          <figure
            key={testimonial.name}
            className={`flex h-full w-[300px] flex-col rounded-2xl border p-7 md:w-[380px] ${
              dark ? "border-white/12 bg-black/55 backdrop-blur-sm" : "border-border bg-background"
            }`}
          >
            <blockquote className={`mb-6 text-[1.05rem] font-light leading-relaxed ${dark ? "text-white/90" : "text-foreground"}`}>
              “{testimonial.quote}”
            </blockquote>
            {/* Pinned to the bottom, so the names line up along the strip. */}
            <figcaption className={`mt-auto flex items-end justify-between gap-4 border-t pt-5 ${dark ? "border-white/12" : "border-border"}`}>
              <span>
                <span className={`block font-medium ${dark ? "text-white" : "text-foreground"}`}>{testimonial.name}</span>
                <span className={`block text-sm leading-snug ${dark ? "text-white/65" : "text-muted-foreground"}`}>{testimonial.role}</span>
              </span>
              {testimonial.company && (
                <span className={`shrink-0 text-xs font-bold uppercase tracking-[0.14em] ${dark ? "text-white" : "text-foreground"}`}>
                  {testimonial.company}
                </span>
              )}
            </figcaption>
          </figure>
        ))}
      />
    </section>
  );
}
