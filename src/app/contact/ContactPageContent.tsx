"use client";

import { Mail, MapPin, Phone } from "lucide-react";

import { Reveal } from "@/components/home/Reveal";
import { PageHero } from "@/components/ui/PageHero";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { CONTACT_INFO } from "@/lib/constants";
import { ContactForm } from "./ContactForm";

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

      <section className="bg-background pb-24">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <div className="space-y-10">
                <h2 className="font-exo text-2xl font-bold tracking-tight text-primary md:text-3xl">
                  {t.contact.infoHeading}
                </h2>

                <ul className="space-y-8">
                  <li className="flex items-start gap-4">
                    <div className="rounded-xl bg-secondary/10 p-3">
                      <Mail className="h-6 w-6 text-secondary" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                        {t.contact.emailLabel}
                      </p>
                      <a
                        href={`mailto:${CONTACT_INFO.email}`}
                        className="mt-1 inline-block text-lg font-medium text-secondary hover:underline"
                      >
                        {CONTACT_INFO.email}
                      </a>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="rounded-xl bg-secondary/10 p-3">
                      <Phone className="h-6 w-6 text-secondary" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                        {t.contact.phoneLabel}
                      </p>
                      <a
                        href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, "")}`}
                        className="mt-1 inline-block text-lg font-medium text-foreground transition-colors hover:text-secondary"
                      >
                        {CONTACT_INFO.phone}
                      </a>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="rounded-xl bg-secondary/10 p-3">
                      <MapPin className="h-6 w-6 text-secondary" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                        {t.contact.addressLabel}
                      </p>
                      <p className="mt-1 max-w-sm text-lg leading-relaxed text-foreground">
                        {CONTACT_INFO.address}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
