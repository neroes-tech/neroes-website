"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { Reveal } from "@/components/home/Reveal";
import { StarRating } from "@/components/ui/StarRating";
import { TESTIMONIALS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function ClientTestimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Tracks which card sits closest to the track's horizontal center, so the
  // pagination dot below stays in sync with free-scrolling/dragging too,
  // not just clicks on the dots themselves.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;

        const trackRect = track.getBoundingClientRect();
        const trackCenter = trackRect.left + trackRect.width / 2;

        let closest = visible[0]!;
        let closestDist = Infinity;
        for (const entry of visible) {
          const rect = entry.target.getBoundingClientRect();
          const dist = Math.abs(rect.left + rect.width / 2 - trackCenter);
          if (dist < closestDist) {
            closestDist = dist;
            closest = entry;
          }
        }

        const index = cards.indexOf(closest.target as HTMLElement);
        if (index !== -1) setActiveIndex(index);
      },
      { root: track, threshold: 0.6 },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const scrollToIndex = (index: number) => {
    const card = trackRef.current?.children[index];
    card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  return (
    <section className="bg-background py-24 md:py-32" aria-labelledby="client-testimonials-heading">
      <div className="container mx-auto px-4 md:px-6">
        <Reveal className="mb-16 text-center">
          <h2 id="client-testimonials-heading" className="font-exo text-4xl font-bold text-primary">
            Clients Love It
          </h2>
        </Reveal>

        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {TESTIMONIALS.map((t) => (
            <article
              key={t.name}
              className="relative w-[85%] shrink-0 snap-start rounded-3xl border border-border bg-card p-8 shadow-sm transition-shadow duration-300 hover:shadow-md sm:w-[60%] lg:w-[31%]"
            >
              {t.companyLogo ? (
                <Image
                  src={t.companyLogo}
                  alt={t.company ?? ""}
                  width={100}
                  height={40}
                  className="absolute right-6 top-6 h-9 w-auto object-contain opacity-90"
                />
              ) : t.company ? (
                // Real logo file not supplied yet — company name stands in
                // as a legible placeholder rather than a blank corner.
                <span className="absolute right-6 top-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t.company}
                </span>
              ) : null}

              <StarRating className="mb-4" />
              <blockquote lang="en" className="pr-16 text-lg leading-relaxed text-foreground">
                &ldquo;{t.content}&rdquo;
              </blockquote>

              <figcaption className="mt-8 flex items-center gap-4 border-t border-border pt-6">
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-gradient-to-br from-brand-blue/15 to-brand-violet/15 font-exo text-base font-bold text-brand-blue"
                >
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="font-bold text-foreground">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </article>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.name}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Ir para o testemunho de ${t.name}`}
              aria-current={activeIndex === i}
              className={cn(
                "h-2 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue",
                activeIndex === i ? "w-6 bg-brand-blue" : "w-2 bg-border hover:bg-muted-foreground/40",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
