"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useMotionValueEvent, useScroll } from "framer-motion";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useSegment } from "@/lib/segment/SegmentProvider";
import { CALENDLY_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

// Corporate/Sports source files are a single portrait PNG (icon stacked over
// a "neroes" + segment wordmark) — too tall to scale down to navbar height
// without shrinking the icon into an unreadable smudge. Instead, only the
// icon (top ~62% of the file, measured against the source art) is cropped
// via a fixed-height overflow-hidden box, and the wordmark is real text set
// alongside it so it stays crisp at any size.
// cropW/cropWMd are computed from each file's own aspect ratio (not w-auto):
// Tailwind's base reset puts `max-width: 100%` on <img>, which — combined
// with a flex item that has no width of its own other than shrink-to-fit —
// resolves to a 0px width once the parent is overflow-hidden. Hardcoding
// both dimensions sidesteps that percentage-of-indeterminate-width bug.
const SEGMENT_ICON = {
  corporate: {
    src: "/neroes-brand-mark.png",
    width: 295,
    height: 382,
    // Tailwind's JIT scanner needs these as literal strings, not
    // runtime-computed numbers, to pick up the arbitrary-value classes.
    imgClassName: "h-[58px] w-[45px] mix-blend-multiply md:h-[65px] md:w-[50px]",
  },
  sports: {
    src: "/sport-logo.png",
    width: 446,
    height: 670,
    imgClassName: "h-[58px] w-[39px] mix-blend-multiply md:h-[65px] md:w-[43px]",
  },
} as const;

export function Navbar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { segment } = useSegment();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 12);
  });

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/services", label: t.nav.services },
    { href: "/brain-experience", label: t.nav.brainExperience },
    { href: "/mental-health-calculator", label: t.nav.calculator },
    { href: "/science", label: t.nav.science },
  ];

  const secondaryLinks = [
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  const segmentIcon = segment === "corporate" || segment === "sports" ? SEGMENT_ICON[segment] : null;

  const linkClass = (href: string) =>
    cn(
      "transition-colors hover:text-primary",
      pathname === href ? "text-primary" : "text-muted-foreground",
    );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        isScrolled || isMobileMenuOpen
          ? "border-border bg-background/90 shadow-md shadow-primary/5 backdrop-blur-xl supports-[backdrop-filter]:bg-background/85"
          : "border-transparent bg-background/70 backdrop-blur-sm supports-[backdrop-filter]:bg-background/40",
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          aria-label="Neroes"
          onClick={closeMenu}
          className="flex flex-row items-center gap-2.5 cursor-pointer"
        >
          {segmentIcon ? (
            <>
              <div className="relative h-9 shrink-0 overflow-hidden px-[3px] md:h-10">
                {/* The source art's circuit nodes sit flush against the
                    canvas edge with no built-in margin — px-[3px] insets the
                    image a few px from the crop box so they don't read as
                    clipped. */}
                <Image
                  src={segmentIcon.src}
                  alt=""
                  width={segmentIcon.width}
                  height={segmentIcon.height}
                  className={segmentIcon.imgClassName}
                  priority
                />
              </div>
              <span className="flex flex-col gap-0 leading-[1.05]">
                <span className="font-exo text-base font-bold leading-[1.05] text-[#0B1C31] md:text-lg">
                  neroes
                </span>
                {segment === "corporate" ? (
                  <span className="font-exo text-sm font-medium leading-[1.05] text-[#0F9CAC] md:text-base">
                    corporate
                  </span>
                ) : (
                  <span className="font-exo text-sm font-semibold italic leading-[1.05] text-[#E31B54] md:text-base">
                    sports
                  </span>
                )}
              </span>
            </>
          ) : (
            <Image
              src="/horizontal.png"
              alt="Neroes"
              width={406}
              height={136}
              className="h-10 w-auto object-contain mix-blend-multiply md:h-12"
              priority
            />
          )}
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}
          {secondaryLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <LanguageSwitcher />
          <Button
            asChild
            className="rounded-full bg-secondary px-6 font-semibold text-secondary-foreground transition-shadow hover:bg-secondary/90 hover:shadow-glow-secondary"
          >
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              {t.nav.schedule}
            </a>
          </Button>
        </div>

        <button
          type="button"
          className="p-2 text-primary md:hidden"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div id="mobile-menu" className="flex flex-col gap-4 border-t border-border bg-background px-4 py-6 md:hidden">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-lg font-medium" onClick={closeMenu}>
              {link.label}
            </Link>
          ))}
          {secondaryLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-lg font-medium" onClick={closeMenu}>
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex items-center justify-between border-t border-border pt-4">
            <LanguageSwitcher />
          </div>
          <div className="flex flex-col gap-4">
            <Button
              asChild
              className="w-full rounded-full bg-secondary font-semibold text-secondary-foreground hover:bg-secondary/90"
            >
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
                {t.nav.schedule}
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
