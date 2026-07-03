"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CALENDLY_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/brain-experience", label: "Brain Experience" },
  { href: "/science", label: "Science" },
];

const SECONDARY_LINKS = [
  { href: "/team", label: "Team" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/mental-health-calculator", label: "Calculator" },
];

const SPORT_LINKS = [
  { href: "/sport", label: "Sport Home" },
  { href: "/sport/science", label: "Sport Science" },
  { href: "/sport/services", label: "Sport Services" },
  { href: "/sport/about", label: "Sport About" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const linkClass = (href: string) =>
    cn(
      "transition-colors hover:text-primary",
      pathname === href ? "text-primary" : "text-muted-foreground",
    );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
          <Image
            src="/neroes-logo.png"
            alt="Neroes"
            width={2648}
            height={3212}
            className="h-10 w-auto"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "flex items-center gap-1 rounded-sm py-2 outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                pathname.startsWith("/sport") ? "text-primary" : "text-muted-foreground",
              )}
            >
              Sport <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {SPORT_LINKS.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href} className="w-full cursor-pointer">
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {SECONDARY_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Button asChild className="bg-secondary font-semibold text-white hover:bg-secondary/90">
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              Schedule Brain Experience
            </a>
          </Button>
        </div>

        <button
          className="p-2 text-primary md:hidden"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div id="mobile-menu" className="flex flex-col gap-4 border-t border-border bg-background px-4 py-6 md:hidden">
          {[...NAV_LINKS].map((link) => (
            <Link key={link.href} href={link.href} className="text-lg font-medium" onClick={closeMenu}>
              {link.label}
            </Link>
          ))}
          <div className="mb-2 mt-2 flex flex-col gap-2 border-l-2 border-muted pl-4">
            <span className="mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Sport
            </span>
            {SPORT_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-base" onClick={closeMenu}>
                {link.label}
              </Link>
            ))}
          </div>
          {SECONDARY_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-lg font-medium" onClick={closeMenu}>
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-4 border-t border-border pt-4">
            <Button asChild className="w-full bg-secondary font-semibold text-white hover:bg-secondary/90">
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
                Schedule Brain Experience
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
