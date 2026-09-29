"use client";

import { PageHero } from "@/components/ui/PageHero";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { CONTACT_INFO } from "@/lib/constants";
import { ContactForm } from "./ContactForm";

const labelClass = "font-mono text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground";

export function ContactPageContent() {
  const { t } = useLanguage();

  return (
    <>
      <PageHero
        eyebrow={t.contact.eyebrow}
        title={t.contact.title}
        subtitle={t.contact.subtitle}
        size="compact"
        maxWidth="3xl"
      />

      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{t.contact.infoHeading}</h2>
              <dl className="mt-8 divide-y divide-border border-y border-border">
                <div className="py-5">
                  <dt className={labelClass}>{t.contact.emailLabel}</dt>
                  <dd className="mt-1.5">
                    <a
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="text-lg font-medium text-secondary underline-offset-4 hover:underline"
                    >
                      {CONTACT_INFO.email}
                    </a>
                  </dd>
                </div>
                <div className="py-5">
                  <dt className={labelClass}>{t.contact.phoneLabel}</dt>
                  <dd className="mt-1.5">
                    <a
                      href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, "")}`}
                      className="text-lg font-medium text-foreground underline-offset-4 hover:underline"
                    >
                      {CONTACT_INFO.phone}
                    </a>
                  </dd>
                </div>
                <div className="py-5">
                  <dt className={labelClass}>{t.contact.addressLabel}</dt>
                  <dd className="mt-1.5 text-lg text-foreground">{t.contact.address}</dd>
                </div>
              </dl>
            </div>

            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
