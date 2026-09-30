"use client";

import { usePathname } from "next/navigation";

import { PartnerLogos } from "@/components/layout/PartnerLogos";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

/**
 * "Com o apoio de" above the footer on the inner pages. The Home shows the
 * same logos right after its Hero, so it skips this bar.
 */
export function PartnersBar() {
  const { t } = useLanguage();
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <section className="bg-background py-16 md:py-20" aria-labelledby="partners-heading">
      <div className="container mx-auto px-4 md:px-6">
        <h2
          id="partners-heading"
          className="text-center text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground"
        >
          {t.shared.partnersHeading}
        </h2>
        <PartnerLogos className="mt-8" />
      </div>
    </section>
  );
}
