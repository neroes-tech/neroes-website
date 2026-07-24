"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useMotionValueEvent, useScroll } from "framer-motion";

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
  { href: "/science", label: "Science" },
  { href: "/brain-experience", label: "Brain Experience" },
];

const SECONDARY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/mental-health-calculator", label: "Calculator" },
];

const SPORT_LINKS = [
  { href: "/sport", label: "Overview" },
  { href: "/sport/services", label: "Mental Training & Neurofeedback" },
  { href: "/sport/science", label: "Science & Case Studies" },
  { href: "/sport/about", label: "Team & Partnerships" },
];

export function Navbar() {
  const pathname = usePathname();
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
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "flex items-center gap-1 rounded-sm py-2 outline-none transition-colors duration-200 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                pathname.startsWith("/sport") ? "text-primary" : "text-muted-foreground",
              )}
            >
              Athletic Performance <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {SPORT_LINKS.map((link) => (
                <DropdownMenuItem key={link.href} asChild className="focus:bg-transparent focus:text-[#1E5BFF]">
                  <Link
                    href={link.href}
                    className="w-full cursor-pointer rounded-sm px-3 py-2.5 text-slate-700 transition-colors duration-200 hover:text-[#1E5BFF]"
                  >
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
              Athletic Performance
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
