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

// Corporate source file (public/neroes-brand-mark.png — the official brand
// asset, updated directly in place when the design team supplies a new
// export) is a single portrait PNG (icon stacked over a "neroes corporate"
// wordmark) — too tall to scale down to navbar height without shrinking the
// icon into an unreadable smudge. Only the icon (top ~62% of the file,
// measured against the source art) is cropped via a fixed-height
// overflow-hidden box, and the wordmark is real text set alongside it so it
// stays crisp at any size. The file ships fully opaque (alpha=255
// everywhere, verified by sampling pixel data) with an off-white/grayish
// background baked in, not true transparency — mix-blend-multiply alone
// can't hide that, since it only fully disappears against a *pure* white
// background. Background is stripped in place via a flood fill anchored to
// a fixed near-white reference (not chained pixel-to-pixel, which would
// bleed through the icon's own color gradients) whenever the source file is
// replaced — see scratchpad/pw/clean-in-place.js; re-run it if the design
// team supplies another update.
// max-w-none cancels Tailwind's preflight `img { max-width: 100% }` reset:
// as a flex item (the parent Link is `flex flex-row`) this image's width is
// auto/indeterminate, and that reset's percentage can't resolve against an
// indeterminate container — it collapses the image to 0px instead of
// falling back to its natural aspect ratio. With max-w-none gone, w-auto
// correctly derives width from height × the image's own aspect ratio.
const SEGMENT_ICON = {
  corporate: {
    src: "/neroes-brand-mark.png",
    width: 295,
    height: 382,
    imgClassName: "h-[58px] w-auto max-w-none mix-blend-multiply md:h-[65px]",
  },
} as const;

// Sports uses the official pre-composed horizontal lockup (icon + "neroes
// sports" wordmark already laid out side by side, unlike the Corporate
// file) — genuinely transparent (verified: ~91% of pixels are alpha=0, the
// rest is the actual artwork), so it's rendered as-is with no crop and no
// separate HTML text.
const SPORTS_LOGO = {
  // Cropped to its actual visible content (see
  // scratchpad/pw/crop-sports-logo.js) — the original 1536x1024 export had
  // the icon+wordmark occupying only a ~1055x431 region in the middle, so a
  // CSS height on the untrimmed canvas left the visible logo a fraction of
  // the box size regardless of how tall the box was set.
  src: "/sport-logo-horizontal.png",
  width: 1115,
  height: 461,
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

  const segmentIcon = segment === "corporate" ? SEGMENT_ICON.corporate : null;

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
          className="flex h-12 flex-row items-center gap-3 cursor-pointer"
        >
          {segment === "sports" ? (
            // Pre-composed lockup, genuinely transparent — no crop, no
            // separate text (the file already contains "neroes sports").
            // max-w-none: see note above SEGMENT_ICON on the flex/preflight
            // 0-width bug this avoids.
            <Image
              src={SPORTS_LOGO.src}
              alt="Neroes Sports"
              width={SPORTS_LOGO.width}
              height={SPORTS_LOGO.height}
              className="h-11 w-auto max-w-none object-contain mix-blend-multiply md:h-12"
              priority
            />
          ) : segmentIcon ? (
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
                <span className="font-exo text-base font-bold leading-[1.05] text-[#0F9CAC] md:text-lg">
                  corporate
                </span>
              </span>
            </>
          ) : (
            <Image
              src="/horizontal.png"
              alt="Neroes"
              width={406}
              height={136}
              // max-w-none cancels Tailwind's preflight `img { max-width:
              // 100% }` reset. Now that the parent Link is a flex row (for
              // the Corporate/Sports icon+text layout), this Image is a flex
              // item with an indeterminate auto width — the percentage in
              // that reset can't resolve against an indeterminate container,
              // which collapses the image to 0px instead of falling back to
              // its natural aspect ratio. w-auto works correctly again once
              // the percentage constraint is gone.
              className="h-14 w-auto max-w-none object-contain mix-blend-multiply md:h-16"
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
