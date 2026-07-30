export const CONTACT_INFO = {
  email: "info@neroes.tech",
  phone: "+351 914 796 058",
  address: "Rua da Prata 80, 5º andar, Lisboa, Portugal",
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

// Logo width is scaled to a shared height of 40 at each file's real aspect
// ratio, so next/image doesn't distort them (object-contain also guards
// against this, but matching the intrinsic ratio avoids a layout-shift
// warning).
//
// `sizeBoost: true` flags logos whose visible mark occupies a much smaller
// fraction of the source canvas than the others (portugal-ventures.png has
// generous internal padding), so a shared height makes it read as noticeably
// smaller/fainter next to the rest — this renders it larger to compensate.
export const PARTNERS = [
  { name: "KPMG", url: "https://home.kpmg/pt/pt/home.html", logo: "/partners/kpmg.png", logoWidth: 40 },
  { name: "BGI", url: "http://bgi.pt/", logo: "/partners/bgi.png", logoWidth: 80 },
  { name: "IPN", url: "https://www.ipn.pt/", logo: "/partners/ipn.png", logoWidth: 75 },
  { name: "IBEB", url: "https://ibeb.ciencias.ulisboa.pt/", logo: "/partners/ibeb.jpg", logoWidth: 45 },
  { name: "FCUL", url: "https://ciencias.ulisboa.pt/", logo: "/partners/fcul.png", logoWidth: 77 },
  {
    name: "Portugal Ventures",
    url: "https://www.portugalventures.pt/en/",
    logo: "/partners/portugal-ventures.png",
    logoWidth: 123,
    sizeBoost: true,
  },
];
