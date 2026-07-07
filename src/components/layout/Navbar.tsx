"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Brain, ChevronDown, Menu, X } from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";

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
  const prefersReducedMotion = useReducedMotion();
  const reduced = prefersReducedMotion ?? false;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 12);
  });

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
          <span
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-secondary/10 text-secondary"
            aria-hidden="true"
          >
            <Brain className="h-5 w-5" />
            <span className="absolute right-0 top-0 flex h-1.5 w-1.5">
              {!reduced && (
                <motion.span
                  className="absolute inline-flex h-full w-full rounded-full bg-secondary"
                  animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
              )}
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-secondary" />
            </span>
          </span>
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
          <Button
            asChild
            className="rounded-full bg-secondary px-6 font-semibold text-secondary-foreground transition-shadow hover:bg-secondary/90 hover:shadow-glow-secondary"
          >
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              Schedule Brain Experience
            </a>
          </Button>
        </div>

        <button
          type="button"
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
            <Button
              asChild
              className="w-full rounded-full bg-secondary font-semibold text-secondary-foreground hover:bg-secondary/90"
            >
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
