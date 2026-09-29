"use client";

import Image from "next/image";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { PARTNERS } from "@/lib/constants";

/**
 * Sits directly above the Footer, on every page — its own light section so
 * the partner logos render in their real colours on hover.
 */
export function PartnersBar() {
  const { t } = useLanguage();

  return (
    <section className="border-t border-border bg-background py-14" aria-labelledby="partners-heading">
      <div className="container mx-auto px-4 md:px-6">
        <h2 id="partners-heading" className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {t.shared.partnersHeading}
        </h2>
        <ul className="mt-8 flex flex-wrap items-center gap-x-12 gap-y-8 md:gap-x-16">
          {PARTNERS.map((partner) => (
            <li key={partner.name} className="flex items-center">
              <a
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block opacity-60 grayscale transition-[filter,opacity] duration-300 hover:opacity-100 hover:grayscale-0 focus-visible:opacity-100 focus-visible:grayscale-0"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={partner.width}
                  height={partner.height}
                  style={{ height: partner.height, width: "auto" }}
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
