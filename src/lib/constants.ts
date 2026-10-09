import { parseBookingUrl } from "@/lib/booking";

export const CONTACT_INFO = {
  email: "info@neroes.tech",
  phone: "+351 918 443 061", // André (Pedro, 9 Oct 2026), replaces +351 914 796 058
  address: "Lisboa, Portugal",
  social: {
    linkedin: "https://www.linkedin.com/company/neroes/",
    instagram: "https://www.instagram.com/neroes.tech/",
    facebook: "https://www.facebook.com/neroes.tech/",
  },
};

/**
 * Booking calendar on the Contacto page (and behind every "Marcar" button,
 * which all lead there): a Google Calendar appointment schedule — the team's
 * choice on 6 Oct 2026 — or a Calendly event. Set NEXT_PUBLIC_BOOKING_URL on
 * Vercel and in .env.local to the schedule's link, or paste the whole
 * <iframe> code from Google's "Website embed" dialog (see src/lib/booking.ts
 * and .env.example). NEXT_PUBLIC_CALENDLY_URL is still read as a fallback.
 * Nothing (or an unsupported link) shows the email/phone fallback instead.
 *
 * Why not a default: the old link (calendly.com/pedro-ebw/brain-experience-event)
 * answers "Este evento está indisponível no momento".
 */
export const BOOKING = parseBookingUrl(process.env.NEXT_PUBLIC_BOOKING_URL || process.env.NEXT_PUBLIC_CALENDLY_URL);

export const SITE_URL = "https://neroes.tech";

// Client and athlete testimonials live in the dictionary (t.shared.testimonials):
// verbatim from the old WordPress site in English, faithfully translated in PT.

// One roster for the /sport/about page — the previous WordPress site listed
// three different, inconsistent rosters.
export const TEAM_MEMBERS = [
  { name: "Pedro Pestana", role: "Co-Founder & CEO" },
  { name: "Hugo Ferreira", role: "Co-Founder & CMO / Lead Scientific Advisor" },
  { name: "Valter Costa", role: "CTO / Chief Technology Officer" },
  { name: "Mafalda Neves", role: "Graphic Design & Illustration" },
  { name: "Ana Monteiro", role: "Psychologist / Neurofeedback Advisor" },
  { name: "Rafael Ramos", role: "Game Developer / Software Engineer" },
  { name: "Duarte Rodrigues", role: "Head of Innovation" },
  { name: "Rudy Jeanne", role: "Research & Development Manager" },
  { name: "André Vilela", role: "Head of Operations & Business Development" },
];

// The logo files are trimmed to their visible mark (no built-in padding, no
// white boxes), so sizes can be set directly. Heights are balanced by area,
// not matched: a squarish mark (IBEB) at the same height as a wide wordmark
// would read twice as heavy. Portugal Ventures gets a little extra for its
// thin, light strokes. width/height are the rendered size (next/image builds
// its 1x/2x sources from them); ratio = the file's own aspect ratio.
const partner = (name: string, url: string, logo: string, height: number, ratio: number) => ({
  name,
  url,
  logo,
  width: Math.round(height * ratio),
  height,
});

export const PARTNERS = [
  partner("KPMG", "https://home.kpmg/pt/pt/home.html", "/partners/kpmg-logo.png", 35, 2.181),
  partner("BGI", "http://bgi.pt/", "/partners/bgi-logo.png", 37, 2.013),
  partner("IPN", "https://www.ipn.pt/", "/partners/ipn-logo.png", 33, 2.45),
  partner("IBEB", "https://ibeb.ciencias.ulisboa.pt/", "/partners/ibeb-logo.png", 47, 1.225),
  partner("FCUL", "https://ciencias.ulisboa.pt/", "/partners/fcul-logo.png", 34, 2.313),
  partner("Portugal Ventures", "https://www.portugalventures.pt/en/", "/partners/portugal-ventures-logo.png", 41, 2.106),
];
