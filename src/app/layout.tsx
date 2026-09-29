import type { Metadata } from "next";
import { Roboto_Condensed, Roboto_Mono } from "next/font/google";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PartnersBar } from "@/components/layout/PartnersBar";
import { SkipLink } from "@/components/layout/SkipLink";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { SegmentProvider } from "@/lib/segment/SegmentProvider";
import { CONTACT_INFO, SITE_URL } from "@/lib/constants";
import "./globals.css";

// Brand manual (06 Tipografia): Roboto Condensed Regular for text, Bold for
// titles. Self-hosted via next/font: no render-blocking CSS @import and no
// font-swap layout shift.
const robotoCondensed = Roboto_Condensed({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-roboto-condensed",
});

// Monospace for instrument-style labels only (section indices, study
// methodology, data captions) — never for running text.
const robotoMono = Roboto_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Neroes — Plataforma de treino mental",
    template: "%s — Neroes",
  },
  description:
    "Neroes: treino mental com neurofeedback por EEG — um circuito fechado entre o teu cérebro e um jogo, com biomarcadores objetivos a registar a mudança. Uma plataforma de treino e investigação para clínica, desporto e trabalho.",
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
  // City only: the street address is not published for now.
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lisbon",
    addressCountry: "PT",
  },
} as const;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Portuguese is what the server renders; LanguageProvider keeps this in
    // step when a visitor switches to English.
    <html lang="pt-PT" className={`${robotoCondensed.variable} ${robotoMono.variable}`}>
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          // Safe: serialized from a fully static, locally-defined object.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <LanguageProvider>
          <SkipLink />
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
