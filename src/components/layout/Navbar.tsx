"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useSegment } from "@/lib/segment/SegmentProvider";
import { CALENDLY_URL } from "@/lib/constants";
import { NEROES_LOCKUP } from "@/lib/brand";
import { cn } from "@/lib/utils";

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
  const closeMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/science", label: t.nav.science },
  ];

  const secondaryLinks = [
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  const linkClass = (href: string) =>
    cn(
      "py-2 transition-colors hover:text-foreground",
      pathname === href ? "text-foreground" : "text-muted-foreground",
    );

  return (
    // Solid bar with a 1px rule — no translucency, blur or shadow shifting on scroll.
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          aria-label="Neroes"
          onClick={closeMenu}
          className="flex h-12 flex-row items-center gap-3 cursor-pointer"
        >
          {segment === "sports" ? (
            // Pre-composed lockup, genuinely transparent — no crop, no
            // separate text (the file already contains "neroes sports").
            // max-w-none: cancels preflight's img max-width:100%, which
            // collapses a flex-item image with auto width to 0px.
            <Image
              src={SPORTS_LOGO.src}
              alt="Neroes Sports"
              width={SPORTS_LOGO.width}
              height={SPORTS_LOGO.height}
              className="h-11 w-auto max-w-none object-contain mix-blend-multiply md:h-12"
              priority
            />
          ) : (
            <Image
              src={NEROES_LOCKUP.src}
              alt="Neroes"
              width={NEROES_LOCKUP.width}
              height={NEROES_LOCKUP.height}
              className="h-8 w-auto max-w-none object-contain md:h-9"
              priority
            />
          )}
        </Link>

        <nav className="hidden items-center gap-7 text-[0.95rem] font-medium md:flex">
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
          <Button asChild>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              {t.nav.schedule}
            </a>
          </Button>
        </div>

        <button
          type="button"
          className="p-2 text-foreground md:hidden"
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
            <Button asChild className="w-full">
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
