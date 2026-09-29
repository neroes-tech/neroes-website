import type { Locale } from "@/lib/i18n/translations";

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

export const CALENDLY_URL = "https://calendly.com/pedro-ebw/brain-experience-event";

// Original source links for the Calculator page's Deloitte/WHO citations —
// carried over from the WordPress site (_referencia/wordpress/mhc), not
// invented. The Deloitte one points to the Drive-hosted PDF copy the
// original site itself linked to (no stable public URL was ever published
// on deloitte.com for this report).
export const EXTERNAL_REPORTS = {
  deloitte: "https://drive.google.com/file/d/1ifG3h_swbY6-xwz8RoHj_vRUtYg5LrZP/view?usp=drive_link",
  who: "https://www.who.int/news-room/fact-sheets/detail/mental-health-at-work",
};

export const SITE_URL = "https://neroes.tech";

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  /** Client company name — only set once confirmed against a real, named affiliation. */
  company?: string;
  /** Path to the client's logo file — only set once the real asset is supplied. */
  companyLogo?: string;
}

// TODO(assets): Bruno confirmed Novartis / Bayer / Mega Hits / CCA Law /
// Valadares as real clients, and the José/Conguito/Joana mapping below — but
// the real logo files for those companies still haven't been supplied. Cards
// render fine without them (see ClientTestimonials.tsx's fallback); the logo
// slot just stays empty until the files are added.
export const TESTIMONIALS: Testimonial[] = [
  {
    name: "José Faria Machado",
    role: "Communication Manager",
    company: "Bayer",
    content:
      "The Neroes platform gave our team the mental clarity needed to excel under pressure. A truly transformative tool.",
  },
  {
    name: "Conguito",
    role: "Humorist/Broadcaster/Musician",
    company: "Mega Hits",
    content:
      "As someone constantly in the public eye, maintaining focus is hard. This brain training changed how I approach my daily work.",
  },
  {
    name: "Joana Caetano",
    role: "Business Intelligence Manager",
    company: "Novartis",
    content:
      "We've seen a measurable improvement in decision-making speed across our department since implementing Neroes.",
  },
  {
    name: "Alice Lobo",
    role: "IT Manager",
    content:
      "The emotional control our team gained has directly translated into fewer mistakes and a much healthier work environment.",
  },
  {
    name: "Maria João Souto",
    role: "Co-Founder & Partner",
    content:
      "Neroes is more than a wellness perk; it is a critical component of our strategy for high performance and employee retention.",
  },
];

// Unified across About/Team/Sport About — the previous WordPress site listed
// three different, inconsistent rosters across these pages.
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

// Bio bullet points, verbatim from the old Team page (only available for these 6 members).
export const TEAM_BIOS: Record<string, string[]> = {
  "Pedro Pestana": [
    "Biomedical Engineer",
    "Experience in different startups",
    "Developer of neurofeedback algorithms",
    "Data Scientist",
  ],
  "Hugo Ferreira": [
    "Graduated in Medicine",
    "PhD in Physics",
    "Founder and CMO (Medical) of NeuropsyAi",
    "Business Development",
    "Judo athlete",
  ],
  "Valter Costa": [
    "Software engineer",
    "Worked 4 years at CERN in software development with real-time data",
    "Game developer",
  ],
  "Mafalda Neves": [
    "Master in scientific Illustration",
    "Concept artist in 2D and 3D",
    "Published work in books and weekly newspapers",
  ],
  "Ana Monteiro": [
    "Specialist in neuromodulation",
    "One of the greatest neurofeedback specialists in Portugal",
    "Master in Psychology",
  ],
  "Rafael Ramos": [
    "Graduated in Biomedical Engineering",
    "Experience developing games and biomedical applications in Unity",
  ],
};

// Portuguese rendering of TEAM_BIOS, line for line, so PT pages don't show
// English lists mid-page.
export const TEAM_BIOS_PT: Record<string, string[]> = {
  "Pedro Pestana": [
    "Engenheiro biomédico",
    "Experiência em várias startups",
    "Desenvolvimento de algoritmos de neurofeedback",
    "Cientista de dados",
  ],
  "Hugo Ferreira": [
    "Licenciado em Medicina",
    "Doutorado em Física",
    "Fundador e CMO (área médica) da NeuropsyAi",
    "Desenvolvimento de negócio",
    "Atleta de judo",
  ],
  "Valter Costa": [
    "Engenheiro de software",
    "4 anos no CERN a desenvolver software com dados em tempo real",
    "Programador de jogos",
  ],
  "Mafalda Neves": [
    "Mestre em Ilustração Científica",
    "Concept artist em 2D e 3D",
    "Trabalho publicado em livros e jornais semanais",
  ],
  "Ana Monteiro": [
    "Especialista em neuromodulação",
    "Uma das maiores especialistas em neurofeedback em Portugal",
    "Mestre em Psicologia",
  ],
  "Rafael Ramos": [
    "Licenciado em Engenharia Biomédica",
    "Experiência a desenvolver jogos e aplicações biomédicas em Unity",
  ],
};

export function teamBios(locale: Locale): Record<string, string[]> {
  return locale === "pt" ? TEAM_BIOS_PT : TEAM_BIOS;
}

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
