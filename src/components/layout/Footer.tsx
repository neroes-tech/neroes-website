"use client";

import Image from "next/image";
import Link from "next/link";

import { NEROES_LOCKUP } from "@/lib/brand";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { CONTACT_INFO } from "@/lib/constants";

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: CONTACT_INFO.social.linkedin },
  { label: "Instagram", href: CONTACT_INFO.social.instagram },
  { label: "Facebook", href: CONTACT_INFO.social.facebook },
] as const;

const linkClass = "inline-block py-1 text-white/75 transition-colors hover:text-white";
const headingClass = "mb-4 font-mono text-xs font-medium uppercase tracking-[0.16em] text-white/50";

export function Footer() {
  const { t } = useLanguage();

  const navItems = [
    { href: "/", label: t.nav.home },
    { href: "/science", label: t.nav.science },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  const legalItems = [
    { href: "/privacy-policy", label: t.footer.privacyPolicy },
    { href: "/terms-conditions", label: t.footer.termsConditions },
  ];

  return (
    <footer className="bg-brand-ink text-white">
      <div className="container mx-auto px-4 py-16 md:px-6 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <span className="inline-block rounded-md bg-background px-3 py-2">
              <Image
                src={NEROES_LOCKUP.src}
                alt="Neroes"
                width={NEROES_LOCKUP.width}
                height={NEROES_LOCKUP.height}
                className="h-7 w-auto max-w-none object-contain"
              />
            </span>
            <p className="mt-6 max-w-sm text-lg font-medium leading-snug">{t.footer.tagline}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">{t.footer.subtagline}</p>
          </div>

          <nav aria-label="Footer navigation" className="md:col-span-2">
            <h2 className={headingClass}>{t.footer.navigationHeading}</h2>
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal navigation" className="md:col-span-2">
            <h2 className={headingClass}>{t.footer.legalHeading}</h2>
            <ul className="space-y-1">
              {legalItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className={headingClass}>{t.footer.contactHeading}</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-white/50">{t.footer.emailLabel}</dt>
                <dd>
                  <a href={`mailto:${CONTACT_INFO.email}`} className={linkClass}>
                    {CONTACT_INFO.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-white/50">{t.footer.phoneLabel}</dt>
                <dd>
                  <a href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, "")}`} className={linkClass}>
                    {CONTACT_INFO.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-white/50">{t.footer.addressLabel}</dt>
                <dd className="py-1 text-white/75">{t.footer.address}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/55 md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Neroes Technologies. {t.footer.copyright}
          </p>
          <ul className="flex gap-6">
            {SOCIAL_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
