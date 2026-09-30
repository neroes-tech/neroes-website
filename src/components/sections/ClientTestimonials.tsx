"use client";

import { Marquee } from "@/components/motion/Marquee";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

/**
 * Every client and athlete quote from the old site — word for word in
 * English, faithfully translated in Portuguese — as one slow strip on black
 * that slides sideways. Pointing at it (or focusing inside it) stops it so a
 * quote can be read; the visible button pauses it outright (WCAG 2.2.2).
 * No star ratings nobody gave.
 */
export function ClientTestimonials() {
  const { t } = useLanguage();
  const shared = t.shared;

  return (
    <section aria-labelledby="client-testimonials-heading" className="bg-black py-20 text-white md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <h2
          id="client-testimonials-heading"
          className="mx-auto max-w-4xl text-center font-exo text-4xl font-medium leading-[1.02] tracking-[-0.035em] md:text-6xl"
        >
          {shared.clientsLoveHeading}
        </h2>
      </div>
      <Marquee
        className="mt-14 md:mt-20"
        durationSeconds={95}
        pauseLabel={shared.testimonialsPause}
        playLabel={shared.testimonialsPlay}
        items={shared.testimonials.map((testimonial) => (
          <figure
            key={testimonial.name}
            className="flex h-full w-[300px] flex-col rounded-2xl border border-white/15 bg-white/[0.06] p-7 md:w-[380px]"
          >
            <blockquote className="mb-6 text-[1.05rem] font-light leading-relaxed text-white/90">
              “{testimonial.quote}”
            </blockquote>
            {/* Pinned to the bottom, so the names line up along the strip. */}
            <figcaption className="mt-auto flex items-end justify-between gap-4 border-t border-white/15 pt-5">
              <span>
                <span className="block font-medium text-white">{testimonial.name}</span>
                <span className="block text-sm leading-snug text-white/55">{testimonial.role}</span>
              </span>
              {testimonial.company && (
                <span className="shrink-0 text-xs font-bold uppercase tracking-[0.14em] text-white">
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
