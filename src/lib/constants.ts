export const CONTACT_INFO = {
  email: "info@neroes.tech",
  phone: "+351 914 796 058",
  address: "TecLabs, Faculty of Sciences of the University of Lisbon, Campo Grande, 1749-106 Lisbon",
  social: {
    linkedin: "https://www.linkedin.com/company/neroes/",
    instagram: "https://www.instagram.com/neroes.tech/",
    facebook: "https://www.facebook.com/neroes.tech/",
  },
};

export const CALENDLY_URL = "https://calendly.com/pedro-ebw/brain-experience-event";

export const SITE_URL = "https://neroes.tech";

export const TESTIMONIALS = [
  {
    name: "José Faria Machado",
    role: "Communication Manager",
    content:
      "The Neroes platform gave our team the mental clarity needed to excel under pressure. A truly transformative tool.",
  },
  {
    name: "Conguito",
    role: "Humorist/Broadcaster/Musician",
    content:
      "As someone constantly in the public eye, maintaining focus is hard. This brain training changed how I approach my daily work.",
  },
  {
    name: "Joana Caetano",
    role: "Business Intelligence Manager",
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

export const PARTNERS = [
  { name: "KPMG", url: "https://home.kpmg/pt/pt/home.html" },
  { name: "BGI", url: "http://bgi.pt/" },
  { name: "IPN", url: "https://www.ipn.pt/" },
  { name: "IBEB", url: "https://ibeb.ciencias.ulisboa.pt/" },
  { name: "FCUL", url: "https://ciencias.ulisboa.pt/" },
  { name: "Portugal Ventures", url: "https://www.portugalventures.pt/en/" },
];
