"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useSegment } from "@/lib/segment/SegmentProvider";
import { NEROES_LOCKUP } from "@/lib/brand";
import { cn } from "@/lib/utils";

// Sports uses its own pre-composed, transparent horizontal lockup.
const SPORTS_LOGO = {
  src: "/sport-logo-horizontal.png",
  width: 1115,
  height: 461,
} as const;

/**
 * Floating pill navigation: one near-opaque black bar that sits over every
 * page (the Hero runs underneath it) — opaque enough that the multicolour
 * logo keeps its contrast over white sections too — logo left, sections centre, language
 * and the booking button right (it opens the Contacto page, where the calendar is). On phones the pill keeps the logo and a menu
 * button; the menu opens as a panel under it.
 */
export function Navbar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { segment } = useSegment();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMenu = () => setIsMobileMenuOpen(false);

  // A route change closes the menu; so does Escape.
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobileMenuOpen]);

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4">
      <div className="pointer-events-auto mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 rounded-full border border-white/15 bg-black/90 pl-5 pr-2 text-white backdrop-blur-md md:h-16 md:pl-7">
        <Link href="/" aria-label="Neroes" onClick={closeMenu} className="flex shrink-0 items-center">
          {segment === "sports" ? (
            <Image
              src={SPORTS_LOGO.src}
              alt="Neroes Sports"
              width={SPORTS_LOGO.width}
              height={SPORTS_LOGO.height}
              className="h-8 w-auto max-w-none object-contain md:h-9"
              priority
            />
          ) : (
            <Image
              src={NEROES_LOCKUP.src}
              alt="Neroes"
              width={NEROES_LOCKUP.width}
              height={NEROES_LOCKUP.height}
              className="h-7 w-auto max-w-none object-contain md:h-8"
              priority
            />
          )}
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "py-2 text-[0.8rem] font-bold uppercase tracking-[0.1em] transition-colors hover:text-white",
                  active ? "text-white" : "text-white/70",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <LanguageSwitcher />
          <Button asChild variant="inverse">
            <Link href="/contact">{t.nav.schedule}</Link>
          </Button>
        </div>

        <button
          type="button"
          className="mr-1 inline-flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white md:hidden"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="pointer-events-auto mx-auto mt-2 max-w-6xl rounded-3xl border border-white/15 bg-black/90 p-6 text-white backdrop-blur-md md:hidden"
        >
          <nav aria-label="Principal" className="flex flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className="border-b border-white/10 py-3 text-2xl font-medium tracking-[-0.02em] last:border-b-0"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex items-center justify-between gap-4">
            <LanguageSwitcher />
            <Button asChild variant="inverse">
              <Link href="/contact" onClick={closeMenu}>
                {t.nav.schedule}
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
