"use client";

import { useState } from "react";

import { StarRating } from "@/components/ui/StarRating";
import { TESTIMONIALS } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

interface SportTestimonial {
  name: string;
  modality: string;
  quote: string;
}

// Real, verified testimonial (docs/content-inventory.md) — add more athletes
// here as their quotes are confirmed; never add an unverified one.
const sportTestimonials: SportTestimonial[] = [
  {
    name: "João Crisóstomo",
    modality: "Judo — Bronze Europeu 2021",
    quote:
      "With this interactive approach, it is simpler and easier to figure out what has to be done to achieve results during the sports competition.",
  },
];

// Reuses the site's real, already-verified corporate testimonials (same
// source as ClientTestimonials.tsx) instead of duplicating or inventing them.
const corporateTestimonials = TESTIMONIALS;

type Tab = "sport" | "corporate";

export function ServicesTabs() {
  const { t } = useLanguage();
  const [tab, setTab] = useState<Tab>("sport");

  const tabButtonClass = (active: boolean) =>
    cn(
      "flex-1 rounded-full px-6 py-2.5 text-sm font-semibold transition-colors",
      active ? "bg-secondary text-secondary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
    );

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div
          role="tablist"
          aria-label={t.services.title}
          className="mx-auto mb-14 flex max-w-md gap-2 rounded-full border border-border bg-muted p-1"
        >
          <button
            type="button"
            role="tab"
            id="services-tab-sport"
            aria-selected={tab === "sport"}
            aria-controls="services-panel-sport"
            onClick={() => setTab("sport")}
            className={tabButtonClass(tab === "sport")}
          >
            {t.services.sportTab}
          </button>
          <button
            type="button"
            role="tab"
            id="services-tab-corporate"
            aria-selected={tab === "corporate"}
            aria-controls="services-panel-corporate"
            onClick={() => setTab("corporate")}
            className={tabButtonClass(tab === "corporate")}
          >
            {t.services.corporateTab}
          </button>
        </div>

        {tab === "sport" ? (
          <div id="services-panel-sport" role="tabpanel" aria-labelledby="services-tab-sport">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-exo text-3xl font-bold text-primary md:text-4xl">
                {t.services.sportHeading}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">{t.services.sportBody}</p>
            </div>

            <h3 className="mt-16 text-center font-exo text-2xl font-bold text-foreground">
              {t.services.testimonialsHeading}
            </h3>
            <div className="mx-auto mt-8 grid max-w-3xl gap-6 sm:grid-cols-2">
              {sportTestimonials.map((item) => (
                <article key={item.name} className="rounded-3xl border border-border bg-card p-8 shadow-sm">
                  <StarRating className="mb-4" />
                  <blockquote lang="en" className="text-lg leading-relaxed text-foreground">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <p className="mt-6 font-bold text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.modality}</p>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div id="services-panel-corporate" role="tabpanel" aria-labelledby="services-tab-corporate">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-exo text-3xl font-bold text-primary md:text-4xl">
                {t.services.corporateHeading}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">{t.services.corporateBody}</p>
            </div>

            <h3 className="mt-16 text-center font-exo text-2xl font-bold text-foreground">
              {t.services.testimonialsHeading}
            </h3>
            <div className="mx-auto mt-8 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {corporateTestimonials.map((item) => (
                <article key={item.name} className="rounded-3xl border border-border bg-card p-8 shadow-sm">
                  <StarRating className="mb-4" />
                  <blockquote lang="en" className="text-lg leading-relaxed text-foreground">
                    &ldquo;{item.content}&rdquo;
                  </blockquote>
                  <p className="mt-6 font-bold text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.role}
                    {item.company ? ` · ${item.company}` : ""}
                  </p>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
