export const CONTACT_INFO = {
  email: "info@neroes.tech",
  phone: "+351 914 796 058",
  address: "Lisboa, Portugal",
  social: {
    linkedin: "https://www.linkedin.com/company/neroes/",
    instagram: "https://www.instagram.com/neroes.tech/",
    facebook: "https://www.facebook.com/neroes.tech/",
  },
};

/**
 * Booking link embedded on the Contacto page (and behind every "Marcar"
 * button, which all lead there). Set NEXT_PUBLIC_CALENDLY_URL — on Vercel and
 * in .env.local — to a public Calendly event link, e.g.
 * https://calendly.com/<user>/<event>. Only calendly.com links are embedded;
 * anything else (or nothing) shows the email/phone fallback instead.
 *
 * Why not a default: the previous link
 * (calendly.com/pedro-ebw/brain-experience-event) now answers "Este evento
 * está indisponível no momento" — embedding it would show a dead calendar.
 * Pedro asked (30 Sept 2026) for André's Calendly.
 */
export const CALENDLY_URL = (() => {
  const raw = process.env.NEXT_PUBLIC_CALENDLY_URL?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === "https:" && (url.hostname === "calendly.com" || url.hostname.endsWith(".calendly.com"))
      ? url.toString()
      : null;
  } catch {
    return null;
  }
})();

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
