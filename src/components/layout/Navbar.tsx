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
import { CALENDLY_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 12);
  });

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/science", label: t.nav.science },
    { href: "/brain-experience", label: t.nav.brainExperience },
    { href: "/services", label: t.nav.services },
  ];

  const secondaryLinks = [
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
    { href: "/mental-health-calculator", label: t.nav.calculator },
  ];

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
        <Link href="/" className="flex items-center gap-2.5" onClick={closeMenu}>
          <Image
            src="/neroes-logo-horizontal.png"
            alt="Neroes"
            width={2039}
            height={771}
            className="h-12 w-auto object-contain mix-blend-multiply md:h-14"
            priority
          />
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
