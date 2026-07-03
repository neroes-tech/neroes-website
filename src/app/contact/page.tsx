import type { Metadata } from "next";

import { CONTACT_INFO } from "@/lib/constants";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Neroes. We are happy to hear from you.",
};

export default function ContactPage() {
  return (
    <section className="bg-background py-24">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-16 text-center">
          <h1 className="font-exo text-4xl font-bold text-primary md:text-5xl">
            Welcome. We are happy to hear from you
          </h1>
        </div>

        <div className="grid items-start gap-16 lg:grid-cols-2">
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="border-b border-border pb-4 font-exo text-2xl font-bold text-foreground">
                Contact Information
              </h2>
              <div className="space-y-4 text-lg">
                <div className="flex flex-col">
                  <span className="mb-1 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Email
                  </span>
                  <a href={`mailto:${CONTACT_INFO.email}`} className="font-medium text-secondary hover:underline">
                    {CONTACT_INFO.email}
                  </a>
                </div>
                <div className="flex flex-col">
                  <span className="mb-1 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Phone
                  </span>
                  <a
                    href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, "")}`}
                    className="text-foreground transition-colors hover:text-secondary"
                  >
                    {CONTACT_INFO.phone}
                  </a>
                </div>
                <div className="flex flex-col">
                  <span className="mb-1 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Headquarters
                  </span>
                  <p className="leading-relaxed text-foreground">{CONTACT_INFO.address}</p>
                </div>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
