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

const linkClass = "inline-block py-1 text-white/65 transition-colors hover:text-white";
const headingClass = "mb-5 text-base font-bold text-white";

/** Black footer: the logo and what Neroes is on the left, then the columns. */
export function Footer() {
  const { t } = useLanguage();

  const navItems = [
    { href: "/", label: t.nav.home },
    { href: "/contact", label: t.nav.contact },
  ];

  const legalItems = [
    { href: "/privacy-policy", label: t.footer.privacyPolicy },
    { href: "/terms-conditions", label: t.footer.termsConditions },
  ];

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 pb-10 pt-24 md:px-6 md:pt-32">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Image
              src={NEROES_LOCKUP.src}
              alt="Neroes"
              width={NEROES_LOCKUP.width}
              height={NEROES_LOCKUP.height}
              className="h-10 w-auto max-w-none object-contain md:h-12"
            />
            <p className="mt-8 max-w-sm text-xl font-light leading-snug text-white/85">{t.footer.tagline}</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/50">{t.footer.subtagline}</p>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2">
            <h2 className={headingClass}>{t.footer.navigationHeading}</h2>
            <ul className="space-y-1.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal" className="lg:col-span-2">
            <h2 className={headingClass}>{t.footer.legalHeading}</h2>
            <ul className="space-y-1.5">
              {legalItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className={headingClass}>{t.footer.contactHeading}</h2>
            <dl className="space-y-4">
              <div>
                <dt className="sr-only">{t.footer.emailLabel}</dt>
                <dd>
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="text-lg text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
                  >
                    {CONTACT_INFO.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.14em] text-white/45">{t.footer.phoneLabel}</dt>
                <dd>
                  <a href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, "")}`} className={linkClass}>
                    {CONTACT_INFO.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.14em] text-white/45">{t.footer.addressLabel}</dt>
                <dd className="py-1 text-white/65">{t.footer.address}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-white/15 pt-6 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
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
