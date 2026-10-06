"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { NEROES_LOGO } from "@/lib/brand";
import { cn } from "@/lib/utils";

/**
 * Floating pill navigation: one near-opaque white bar that sits over every
 * page (the Hero runs underneath it). White because the "neroes corporate"
 * logo has a dark navy wordmark that disappears on black. Three columns from md up:
 * logo left, sections in the true centre of the pill, language and the
 * booking button right (it opens the Contacto page, where the calendar is).
 * On phones the pill keeps the logo and a menu button; the menu opens as a
 * panel under it.
 */
export function Navbar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeMenu = () => setIsMobileMenuOpen(false);
  // A link to the page already open changes no route, so nothing would move
  // focus: hand it back to the menu button instead of dropping it on <body>.
  const closeMenuFrom = (href: string) => {
    closeMenu();
    if (href === pathname) toggleRef.current?.focus();
  };

  // A route change closes the menu; so does Escape, returning focus to the
  // menu button when it was inside the menu (WCAG 2.4.3).
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const inMenu = document.getElementById("mobile-menu")?.contains(document.activeElement);
      setIsMobileMenuOpen(false);
      if (inMenu) toggleRef.current?.focus();
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
      <div className="pointer-events-auto mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 rounded-full border border-foreground/10 bg-background/95 pl-5 pr-2 text-foreground shadow-sm backdrop-blur-md md:grid md:h-16 md:grid-cols-[1fr_auto_1fr] md:pl-7">
        <Link href="/" aria-label="Neroes corporate" onClick={closeMenu} className="flex shrink-0 items-center md:justify-self-start">
          <Image
            src={NEROES_LOGO.src}
            alt=""
            width={NEROES_LOGO.width}
            height={NEROES_LOGO.height}
            className="h-7 w-auto max-w-none object-contain md:h-8"
            priority
          />
        </Link>

        <nav aria-label={t.nav.mainLabel} className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "py-2 text-[0.8rem] font-bold uppercase tracking-[0.1em] transition-colors hover:text-foreground",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 md:flex md:justify-self-end">
          <LanguageSwitcher />
          <Button asChild>
            <Link href="/contact">{t.nav.schedule}</Link>
          </Button>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="mr-1 inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-foreground/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring md:hidden"
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
          className="pointer-events-auto mx-auto mt-2 max-w-6xl rounded-3xl border border-foreground/10 bg-background/95 p-6 text-foreground shadow-sm backdrop-blur-md md:hidden"
        >
          <nav aria-label={t.nav.mainLabel} className="flex flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className="border-b border-foreground/10 py-3 text-2xl font-medium tracking-[-0.02em] last:border-b-0"
                onClick={() => closeMenuFrom(link.href)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex items-center justify-between gap-4">
            <LanguageSwitcher />
            <Button asChild>
              <Link href="/contact" onClick={() => closeMenuFrom("/contact")}>
                {t.nav.schedule}
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
