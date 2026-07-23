import Image from "next/image";

import { Reveal } from "@/components/home/Reveal";
import { PARTNERS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Sits directly above the Footer, on every page — deliberately its own
 * light section (not inside the dark Footer) so the partner logos render
 * in their real colors, no invert/chip workaround needed.
 */
export function PartnersBar() {
  return (
    <section className="border-t border-border bg-[#FAFAF7] py-16" aria-label="Parceiros">
      <div className="container mx-auto px-4 md:px-6">
        <Reveal className="flex flex-col items-center text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Com o apoio de
          </p>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:gap-x-16">
            {PARTNERS.map((partner) => (
              <li key={partner.name} className="flex items-center">
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={partner.name}
                  className="inline-block grayscale opacity-60 transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={partner.logoWidth}
                    height={partner.sizeBoost ? 88 : 40}
                    className={cn(
                      "w-auto object-contain",
                      partner.sizeBoost ? "h-20 min-w-[120px] md:h-24" : "h-8 md:h-10",
                    )}
                  />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
