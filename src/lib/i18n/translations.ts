export type Locale = "pt" | "en";

export interface Translations {
  nav: {
    home: string;
    science: string;
    brainExperience: string;
    services: string;
    about: string;
    contact: string;
    calculator: string;
    schedule: string;
    openMenu: string;
    closeMenu: string;
  };
  services: {
    eyebrow: string;
    title: string;
    sportTab: string;
    corporateTab: string;
    sportHeading: string;
    sportBody: string;
    corporateHeading: string;
    corporateBody: string;
    testimonialsHeading: string;
  };
}

// Phase 1 of PT/EN support: Navbar + the new Services page. The rest of the
// site (Home, About, Science, Brain Experience, etc.) is still
// Portuguese-only hardcoded text and needs its own migration pass to read
// from this dictionary before the language switch is truly site-wide.
export const translations: Record<Locale, Translations> = {
  pt: {
    nav: {
      home: "Início",
      science: "Ciência",
      brainExperience: "Brain Experience",
      services: "Serviços",
      about: "Sobre",
      contact: "Contacto",
      calculator: "Calculadora",
      schedule: "Marcar uma demonstração",
      openMenu: "Abrir menu",
      closeMenu: "Fechar menu",
    },
    services: {
      eyebrow: "Serviços",
      title: "Uma plataforma, dois caminhos",
      sportTab: "Desporto",
      corporateTab: "Empresas",
      sportHeading: "Alta performance para atletas de elite",
      sportBody:
        "Stress e ansiedade são as principais causas de quebra de rendimento sob pressão. O Neroes MTP™ treina o controlo emocional e a tomada de decisão dos atletas, sessão após sessão.",
      corporateHeading: "Resiliência e liderança para equipas",
      corporateBody:
        "Presenteísmo, absentismo e turnover têm um custo real. O Neroes treina foco, controlo emocional e resiliência — reduzindo o burnout e reforçando a liderança das equipas.",
      testimonialsHeading: "O que dizem",
    },
  },
  en: {
    nav: {
      home: "Home",
      science: "Science",
      brainExperience: "Brain Experience",
      services: "Services",
      about: "About",
      contact: "Contact",
      calculator: "Calculator",
      schedule: "Schedule a demo",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    services: {
      eyebrow: "Services",
      title: "One platform, two paths",
      sportTab: "Sport",
      corporateTab: "Corporate",
      sportHeading: "High performance for elite athletes",
      sportBody:
        "Stress and anxiety are the leading cause of performance breakdown under pressure. Neroes MTP™ trains athletes' emotional control and decision-making, session after session.",
      corporateHeading: "Resilience and leadership for teams",
      corporateBody:
        "Presenteeism, absenteeism, and turnover carry a real cost. Neroes trains focus, emotional control, and resilience — reducing burnout and strengthening team leadership.",
      testimonialsHeading: "What people say",
    },
  },
};
