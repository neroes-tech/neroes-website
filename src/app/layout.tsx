import type { Metadata } from "next";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PartnersBar } from "@/components/layout/PartnersBar";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { SegmentProvider } from "@/lib/segment/SegmentProvider";
import { CONTACT_INFO, SITE_URL } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Neroes — Mental Training Platform",
    template: "%s — Neroes",
  },
  description:
    "Neroes improves mental performance in corporations and sports through neurofeedback-based mental training.",
  icons: {
    icon: { url: "/favicon-brain-transparent.png", type: "image/png" },
    shortcut: { url: "/favicon-brain-transparent.png", type: "image/png" },
    apple: { url: "/favicon-brain-transparent.png", type: "image/png" },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Neroes",
  url: SITE_URL,
  logo: `${SITE_URL}/neroes-logo.png`,
  sameAs: [
    CONTACT_INFO.social.linkedin,
    CONTACT_INFO.social.instagram,
    CONTACT_INFO.social.facebook,
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua da Prata 80, 5º andar",
    addressLocality: "Lisbon",
    addressCountry: "PT",
  },
} as const;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          // Safe: serialized from a fully static, locally-defined object.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to main content
        </a>
        <LanguageProvider>
          <SegmentProvider>
            <Navbar />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <PartnersBar />
            <Footer />
          </SegmentProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
