export type Locale = "pt" | "en";

interface NamedItem {
  title: string;
  desc: string;
}

interface Pillar {
  title: string;
  body: string;
}

interface ProblemFact {
  title: string;
  stat: string;
  detail: string;
}

interface SciencePillar {
  title: string;
  desc: string;
}

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
    sportTestimonialsHeading: string;
    corporateHeading: string;
    corporateBody: string;
    testimonialsHeading: string;
  };
  home: {
    heroHeadlineLine1: string;
    heroHeadlineLine2: string;
    heroSubtitle: string;
    heroPrimaryCta: string;
    heroSecondaryCta: string;
    problemEyebrow: string;
    problemTitle: string;
    problemSubtitle: string;
    platformEyebrow: string;
    howItWorksHeading: string;
    howItWorksSubtitlePrefix: string;
    pillars: [Pillar, Pillar, Pillar];
    platformHeading: string;
    platformSubtitle: string;
    platformFeatures: [NamedItem, NamedItem, NamedItem, NamedItem, NamedItem, NamedItem];
    benefitsHeading: string;
    benefits: [NamedItem, NamedItem, NamedItem];
    featuresHeading: string;
    features: [NamedItem, NamedItem, NamedItem];
    heroKpiLabels: [string, string, string];
    evidenceEyebrow: string;
    statsLabels: [string, string, string, string];
    finalCtaHeading: string;
    finalCtaBody: string;
    finalCtaPrimary: string;
    finalCtaSecondary: string;
    foundersHeading: string;
    viewTeamLink: string;
  };
  footer: {
    tagline: string;
    subtagline: string;
    navigationHeading: string;
    legalHeading: string;
    contactHeading: string;
    emailLabel: string;
    phoneLabel: string;
    addressLabel: string;
    address: string;
    privacyPolicy: string;
    termsConditions: string;
    copyright: string;
  };
  calculatorScience: {
    heading: string;
    point1: string;
    point2: string;
    point3: string;
    ctaLabel: string;
  };
  shared: {
    problemFacts: [ProblemFact, ProblemFact, ProblemFact];
    clientsLoveHeading: string;
    goToTestimonial: string;
    partnersHeading: string;
  };
  science: {
    eyebrow: string;
    title: string;
    subtitle: string;
    pillars: [SciencePillar, SciencePillar, SciencePillar];
    statsHeading: string;
    statsLabels: [string, string, string, string];
    sportCtaText: string;
    sportCtaButton: string;
  };
  brainExperience: {
    title: string;
    subtitleHeading: string;
    description: string;
    ctaButton: string;
    videoHeading: string;
    statsLabels: [string, string, string];
  };
  about: {
    eyebrow: string;
    title: string;
    visionEyebrow: string;
    visionTitle: string;
    visionIntro: string;
    teamEyebrow: string;
    teamTitle: string;
    teamIntro: string;
    partnershipsEyebrow: string;
    partnershipsTitle: string;
    testimonialsTitle: string;
    testimonialQuote: string;
    testimonialAuthor: string;
    ctaButton: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    subtitle: string;
    infoHeading: string;
    emailLabel: string;
    phoneLabel: string;
    addressLabel: string;
    address: string;
    form: {
      nameLabel: string;
      emailLabel: string;
      phoneLabel: string;
      messageLabel: string;
      gdprPrefix: string;
      gdprLink: string;
      gdprSuffix: string;
      submitLabel: string;
      submittingLabel: string;
      successMessage: string;
      errorFallback: string;
      nameError: string;
      emailError: string;
      gdprError: string;
    };
  };
  mentalScore: {
    badge: string;
    heading: string;
    description: string;
    biomarkerLabels: [string, string, string, string];
    weightPrefix: string;
    weightMiddle: string;
    scoreLabel: string;
    disclaimer: string;
  };
  calculator: {
    eyebrow: string;
    title: string;
    subtitle: string;
    form: {
      industryLabel: string;
      industries: string[];
      employeesLabel: string;
      employeesError: string;
      salaryLabel: string;
      salaryHint: string;
      submitLabel: string;
      placeholderText: string;
      totalHeading: string;
      presenteeismLabel: string;
      presenteeismDesc: string;
      absenteeismLabel: string;
      absenteeismDesc: string;
      turnoverLabel: string;
      turnoverDesc: string;
    };
    bottomQuote1: string;
    bottomQuote1Author: string;
    bottomQuote2: string;
    bottomQuote2Author: string;
    ctaButton1: string;
    ctaButton2: string;
  };
}

// Full-site PT/EN dictionary: Navbar, Footer, Home, Services, Science,
// Brain Experience, About, Contact, and the Calculator flow.
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
      sportHeading: "Neurotecnologia aplicada ao desporto de elite",
      sportBody:
        "Stress e ansiedade são as principais causas de quebra de rendimento sob pressão. O Neroes MTP™ treina o controlo emocional e a tomada de decisão dos atletas, sessão após sessão.",
      sportTestimonialsHeading: "Casos de sucesso em alta competição",
      corporateHeading: "Resiliência e liderança para equipas",
      corporateBody:
        "Presenteísmo, absentismo e turnover têm um custo real. O Neroes treina foco, controlo emocional e resiliência — reduzindo o burnout e reforçando a liderança das equipas.",
      testimonialsHeading: "O que dizem",
    },
    home: {
      heroHeadlineLine1: "Treinamos o cérebro",
      heroHeadlineLine2: "como treinas o corpo.",
      heroSubtitle:
        "Um headset EEG lê as tuas ondas cerebrais enquanto jogas um jogo que só se ganha mantendo a calma e a concentração — treinando foco, controlo emocional e resiliência, sessão após sessão.",
      heroPrimaryCta: "Marcar uma demonstração",
      heroSecondaryCta: "Ver a ciência",
      problemEyebrow: "01 — O Problema",
      problemTitle: "O custo real do stress no trabalho",
      problemSubtitle:
        "Stress e ansiedade não geridos têm um custo mensurável para as organizações — antes de olhar para a solução, os números do problema.",
      platformEyebrow: "02 — A Plataforma",
      howItWorksHeading: "Como funciona",
      howItWorksSubtitlePrefix: "Treino de redes neurais focado em",
      pillars: [
        {
          title: "Captação de sinal",
          body: "Headsets EEG e biossensores leem o teu estado cerebral várias vezes por segundo — a mesma leitura em tempo real usada no headset Neroes.",
        },
        {
          title: "Treino adaptativo",
          body: "Um jogo orientado por IA ajusta o desafio em tempo real conforme os teus sinais: o objetivo é simples — mantém-te calmo e focado para avançar.",
        },
        {
          title: "Evolução e métricas",
          body: "Os sinais cerebrais são monitorizados sessão após sessão e transformados em métricas objetivas — a mesma visualização clínica que usamos para provar resultados reais.",
        },
      ],
      platformHeading: "A plataforma",
      platformSubtitle: "Um instrumento de precisão para a mente humana.",
      platformFeatures: [
        {
          title: "Sessões neurocientíficas",
          desc: "Protocolos de treino desenhados com base em neurociência, organizados em sessões progressivas que constroem resultados ao longo do tempo.",
        },
        {
          title: "Biofeedback por EEG",
          desc: "Um headset EEG lê as ondas cerebrais em tempo real e transforma-as em feedback imediato dentro do jogo — só ganhas se mantiveres a calma e o foco.",
        },
        {
          title: "Analytics de performance",
          desc: "Métricas objetivas de evolução, sessão a sessão: foco, controlo emocional e resiliência tornam-se dados que podes acompanhar.",
        },
        {
          title: "Personalização",
          desc: "Cada programa adapta-se ao ponto de partida e aos objetivos de cada pessoa — o treino evolui contigo.",
        },
        {
          title: "Multi-equipa",
          desc: "Pensado para organizações e clubes: acompanha várias equipas e perfis na mesma plataforma, com visão agregada e individual.",
        },
        {
          title: "Privacidade clínica",
          desc: "Os dados cerebrais são tratados com o rigor e a confidencialidade de dados clínicos, em conformidade com o RGPD.",
        },
      ],
      benefitsHeading: "Benefícios",
      benefits: [
        { title: "Saúde organizacional", desc: "Equipas mais coesas e melhores dinâmicas de colaboração." },
        { title: "Mais produtividade", desc: "Rendimento mais alto com redução significativa de erros." },
        { title: "Desenvolvimento pessoal", desc: "Pessoas mais felizes e mais realizadas." },
      ],
      featuresHeading: "Funcionalidades",
      features: [
        { title: "Melhor comunicação", desc: "Reforço da liderança e das competências interpessoais." },
        { title: "Melhor desempenho", desc: "Execução de alto nível sustentada sob pressão." },
        { title: "Qualidade do sono", desc: "Melhoria do bem-estar geral e da recuperação." },
      ],
      evidenceEyebrow: "03 — A Evidência",
      heroKpiLabels: ["Controlo emocional", "Velocidade de decisão", "Ansiedade"],
      statsLabels: ["Controlo emocional", "Velocidade de decisão", "Autoconfiança", "Ansiedade"],
      finalCtaHeading: "Pronto para treinar a tua mente?",
      finalCtaBody:
        "Marca uma demonstração e experimenta o biofeedback por EEG ao vivo — vê em tempo real o que acontece quando aprendes a manter a calma e o foco.",
      finalCtaPrimary: "Marcar uma demonstração",
      finalCtaSecondary: "Ver a ciência",
      foundersHeading: "Quem fundou a Neroes",
      viewTeamLink: "Ver toda a equipa",
    },
    footer: {
      tagline: "Um instrumento de precisão para a mente humana.",
      subtagline: "Melhora o desempenho mental em empresas e no desporto.",
      navigationHeading: "Navegação",
      legalHeading: "Legal",
      contactHeading: "Contacto",
      emailLabel: "Email",
      phoneLabel: "Telefone",
      addressLabel: "Morada",
      address: "Rua da Prata 80, 5º andar, Lisboa, Portugal",
      privacyPolicy: "Política de Privacidade",
      termsConditions: "Termos e Condições",
      copyright: "Todos os direitos reservados.",
    },
    calculatorScience: {
      heading: "Base Científica & Validação",
      point1:
        "Neurofeedback e leitura por EEG, em colaboração com o Instituto de Biofísica e Engenharia Biomédica (IBEB) e a Faculdade de Ciências da Universidade de Lisboa (FCUL).",
      point2:
        "Caso de estudo real de 4 meses com as equipas do Estoril Praia, com melhorias mensuráveis em controlo emocional e velocidade de decisão.",
      point3:
        "Testemunhos reais de atletas de alta competição e de líderes empresariais, já validados nesta plataforma.",
      ctaLabel: "Saber mais sobre o método científico",
    },
    shared: {
      problemFacts: [
        {
          title: "Presenteísmo",
          stat: "57 dias de trabalho perdidos/ano",
          detail: "60% dos colaboradores afetados",
        },
        {
          title: "Absenteísmo",
          stat: "17.5% das baixas médicas devido à saúde mental",
          detail: "43.3 dias/ano em média",
        },
        {
          title: "Rotatividade (Turnover)",
          stat: "Custa até 2.3x mais que prestar apoio",
          detail: "Redução de turnover até 60%",
        },
      ],
      clientsLoveHeading: "Os nossos clientes adoram",
      goToTestimonial: "Ir para o testemunho de {name}",
      partnersHeading: "Com o apoio de",
    },
    science: {
      eyebrow: "Ciência",
      title: "A neurociência por trás da Neroes",
      subtitle:
        "A Plataforma de Treino Mental Neroes™ não seria possível sem investigação aprofundada e estudos validados sobre saúde mental e os seus efeitos no rendimento humano.",
      pillars: [
        {
          title: "Captação de sinal EEG",
          desc: "Um headset vestível de eletroencefalografia (EEG) lê a atividade elétrica do cérebro em tempo real.",
        },
        {
          title: "Treino de Neurofeedback",
          desc: "Esses sinais controlam um videojogo que só se ganha ao atingir genuinamente um estado mental mais calmo e focado.",
        },
        {
          title: "Progresso Mensurável",
          desc: "Algoritmos adaptativos acompanham a evolução de cada utilizador ao longo das sessões, tornando o treino mais exigente à medida que as competências melhoram.",
        },
      ],
      statsHeading: "Resultados observados em equipas empresariais",
      statsLabels: ["Controlo Emocional", "Velocidade de Decisão", "Autoconfiança", "Ansiedade"],
      sportCtaText: "Tens curiosidade sobre como isto funciona em equipas de desporto de elite?",
      sportCtaButton: "Ver o caso de estudo de Ciência do Desporto",
    },
    brainExperience: {
      title: "THE BRAIN EXPERIENCE™",
      subtitleHeading: "Evento de 1 Dia de Saúde Mental para Empresas",
      description:
        "Este evento corporativo de 1 dia permite que até 20 colaboradores tenham uma experiência individual de 30 minutos. Cada experiência é composta por 2 partes: Conduzir com a Mente / Demonstração de Treino Cerebral.",
      ctaButton: "Agendar Brain Experience",
      videoHeading: "Até a Rock in Rio quis experimentar!",
      statsLabels: ["Pessoas que já experienciaram", "Empresas", "Net Promoter Score"],
    },
    about: {
      eyebrow: "Quem Somos",
      title: "Sobre a Neroes",
      visionEyebrow: "A nossa visão",
      visionTitle: "A nossa visão: capacitação humana",
      visionIntro:
        "A Neroes começou como uma ideia desenvolvida por Pedro Pestana e Hugo Ferreira enquanto trabalhavam na Faculdade de Ciências da Universidade de Lisboa. Ambos trazem uma paixão pelo desempenho humano e o desejo de colocar o conhecimento científico e tecnológico ao serviço da capacitação humana.",
      teamEyebrow: "As pessoas",
      teamTitle: "A Nossa Equipa",
      teamIntro:
        "Somos movidos pela exploração do potencial humano, numa harmonia perfeita entre emoção e lógica, já que as competências da nossa equipa correspondem exatamente às necessidades do projeto: neurociência, psicologia, desenvolvimento de videojogos e software, análise de dados e tradução do conhecimento académico para o mundo empresarial.",
      partnershipsEyebrow: "A trabalhar em conjunto",
      partnershipsTitle: "Parcerias",
      testimonialsTitle: "O que dizem sobre nós",
      testimonialQuote:
        "O objetivo do jogo é simples e claro: focar e focar melhor, eliminando a ansiedade. E o jogo cumpre esse objetivo.",
      testimonialAuthor: "— Inês, 21 anos",
      ctaButton: "Fala connosco!",
    },
    contact: {
      eyebrow: "Contacto",
      title: "Bem-vindo. Estamos gratos pelo seu contacto",
      subtitle:
        "Perguntas sobre a plataforma, a ciência, ou uma demonstração ao vivo — envie-nos uma mensagem e entraremos em contacto brevemente.",
      infoHeading: "Informações de Contacto",
      emailLabel: "Email",
      phoneLabel: "Telefone",
      addressLabel: "Sede",
      address: "Rua da Prata 80, 5º andar, Lisboa, Portugal",
      form: {
        nameLabel: "Nome *",
        emailLabel: "Email *",
        phoneLabel: "Telefone",
        messageLabel: "Mensagem",
        gdprPrefix: "Concordo com o tratamento dos meus dados pessoais conforme descrito na ",
        gdprLink: "Política de Privacidade",
        gdprSuffix: ". *",
        submitLabel: "Enviar Mensagem",
        submittingLabel: "A enviar...",
        successMessage: "Obrigado. A sua mensagem foi enviada com sucesso. Entraremos em contacto brevemente.",
        errorFallback:
          "Algo correu mal. Por favor tente novamente ou envie-nos um email diretamente para info@neroes.tech.",
        nameError: "O nome é obrigatório",
        emailError: "Endereço de email inválido",
        gdprError: "Tem de aceitar a política de privacidade",
      },
    },
    calculator: {
      eyebrow: "Calculadora",
      title: "Economia da Saúde Mental - Calculadora Corporativa",
      subtitle: "Descubra os custos ocultos da falta de saúde mental na sua empresa.",
      form: {
        industryLabel: "Setor / Indústria",
        industries: [
          "Saúde",
          "Finanças",
          "Tecnologia",
          "Retalho",
          "Indústria Transformadora",
          "Educação",
          "Governo",
          "Hotelaria",
          "Jurídico",
          "Media e Entretenimento",
          "Transportes",
          "Construção",
          "Energia e Utilities",
          "Serviços Profissionais",
          "Outro",
        ],
        employeesLabel: "Número de Colaboradores",
        employeesError: "Tem de ter pelo menos 1 colaborador",
        salaryLabel: "Salário Médio Anual em EUR (opcional)",
        salaryHint: "Assume €35.000 se deixado em branco",
        submitLabel: "Calcular Custo",
        placeholderText:
          "Insira os dados da sua empresa para ver o impacto financeiro oculto da falta de saúde mental.",
        totalHeading: "Custo Total Anual Estimado",
        presenteeismLabel: "Presenteísmo",
        presenteeismDesc: "20% de perda de produtividade",
        absenteeismLabel: "Absenteísmo",
        absenteeismDesc: "17.5% de baixas médicas",
        turnoverLabel: "Rotatividade (Turnover)",
        turnoverDesc: "15% do custo anual da folha salarial",
      },
      bottomQuote1: "Por cada 1€ investido em saúde mental, as empresas têm um ROI de 5€.",
      bottomQuote1Author: "— Deloitte, Relatório de Saúde Mental e Colaboradores 2024",
      bottomQuote2:
        "Estima-se que, globalmente, se percam 12 mil milhões de dias de trabalho por ano devido a depressão e ansiedade, a um custo de 1 bilião de dólares por ano.",
      bottomQuote2Author: "— Organização Mundial da Saúde",
      ctaButton1: "Descubra como resolver este problema",
      ctaButton2: "Saiba mais sobre a nossa solução",
    },
    mentalScore: {
      badge: "Simulador de Performance Neural",
      heading: "Demonstrativo — não é um diagnóstico clínico",
      description:
        "Ajusta os sliders para simular o teu progresso em cada indicador, até ao ganho máximo já documentado nos nossos estudos de caso. O score combina os quatro indicadores com o peso usado no nosso painel de telemetria interno.",
      biomarkerLabels: ["Controlo Emocional", "Velocidade de Decisão", "Autoconfiança", "Redução de Ansiedade"],
      weightPrefix: "até",
      weightMiddle: "· peso",
      scoreLabel: "Mental Score",
      disclaimer:
        "Simulação ilustrativa baseada nos ganhos médios documentados nos estudos de caso Neroes. Não substitui avaliação clínica ou psicológica profissional.",
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
      sportHeading: "Neurotechnology applied to elite sport",
      sportBody:
        "Stress and anxiety are the leading cause of performance breakdown under pressure. Neroes MTP™ trains athletes' emotional control and decision-making, session after session.",
      sportTestimonialsHeading: "Success stories in elite competition",
      corporateHeading: "Resilience and leadership for teams",
      corporateBody:
        "Presenteeism, absenteeism, and turnover carry a real cost. Neroes trains focus, emotional control, and resilience — reducing burnout and strengthening team leadership.",
      testimonialsHeading: "What people say",
    },
    home: {
      heroHeadlineLine1: "We train the brain",
      heroHeadlineLine2: "like you train the body.",
      heroSubtitle:
        "An EEG headset reads your brainwaves while you play a game that's only won by staying calm and focused — training focus, emotional control, and resilience, session after session.",
      heroPrimaryCta: "Schedule a demo",
      heroSecondaryCta: "See the science",
      problemEyebrow: "01 — The Problem",
      problemTitle: "The real cost of workplace stress",
      problemSubtitle:
        "Unmanaged stress and anxiety carry a measurable cost for organizations — before looking at the solution, the numbers behind the problem.",
      platformEyebrow: "02 — The Platform",
      howItWorksHeading: "How it works",
      howItWorksSubtitlePrefix: "Neural network training focused on",
      pillars: [
        {
          title: "Signal capture",
          body: "EEG headsets and biosensors read your brain state several times per second — the same real-time reading used in the Neroes headset.",
        },
        {
          title: "Adaptive training",
          body: "An AI-driven game adjusts the challenge in real time based on your signals: the goal is simple — stay calm and focused to advance.",
        },
        {
          title: "Progress and metrics",
          body: "Brain signals are monitored session after session and turned into objective metrics — the same clinical visualization we use to prove real results.",
        },
      ],
      platformHeading: "The platform",
      platformSubtitle: "A precision instrument for the human mind.",
      platformFeatures: [
        {
          title: "Neuroscience-based sessions",
          desc: "Training protocols designed on neuroscience, organized into progressive sessions that build results over time.",
        },
        {
          title: "EEG biofeedback",
          desc: "An EEG headset reads brainwaves in real time and turns them into immediate feedback inside the game — you only win by staying calm and focused.",
        },
        {
          title: "Performance analytics",
          desc: "Objective progress metrics, session by session: focus, emotional control, and resilience become data you can track.",
        },
        {
          title: "Personalization",
          desc: "Each program adapts to each person's starting point and goals — training evolves with you.",
        },
        {
          title: "Multi-team",
          desc: "Built for organizations and clubs: track multiple teams and profiles on the same platform, with aggregate and individual views.",
        },
        {
          title: "Clinical privacy",
          desc: "Brain data is handled with the rigor and confidentiality of clinical data, in compliance with GDPR.",
        },
      ],
      benefitsHeading: "Benefits",
      benefits: [
        { title: "Organizational health", desc: "More cohesive teams and better collaboration dynamics." },
        { title: "More productivity", desc: "Higher output with a significant reduction in errors." },
        { title: "Personal development", desc: "Happier, more fulfilled people." },
      ],
      featuresHeading: "Features",
      features: [
        { title: "Better communication", desc: "Stronger leadership and interpersonal skills." },
        { title: "Better performance", desc: "High-level execution sustained under pressure." },
        { title: "Sleep quality", desc: "Improved overall well-being and recovery." },
      ],
      evidenceEyebrow: "03 — The Evidence",
      heroKpiLabels: ["Emotional control", "Decision speed", "Anxiety"],
      statsLabels: ["Emotional control", "Decision speed", "Self-confidence", "Anxiety"],
      finalCtaHeading: "Ready to train your mind?",
      finalCtaBody:
        "Schedule a demo and try EEG biofeedback live — see in real time what happens when you learn to stay calm and focused.",
      finalCtaPrimary: "Schedule a demo",
      finalCtaSecondary: "See the science",
      foundersHeading: "Who founded Neroes",
      viewTeamLink: "See the whole team",
    },
    footer: {
      tagline: "A precision instrument for the human mind.",
      subtagline: "Improve mental performance in corporations and sports.",
      navigationHeading: "Navigation",
      legalHeading: "Legal",
      contactHeading: "Contact Us",
      emailLabel: "Email",
      phoneLabel: "Phone",
      addressLabel: "Address",
      address: "Rua da Prata 80, 5th floor, Lisbon, Portugal",
      privacyPolicy: "Privacy Policy",
      termsConditions: "Terms and Conditions",
      copyright: "All rights reserved.",
    },
    calculatorScience: {
      heading: "Scientific Basis & Validation",
      point1:
        "Neurofeedback and EEG reading, developed in collaboration with the Institute of Biophysics and Biomedical Engineering (IBEB) and the Faculty of Sciences of the University of Lisbon (FCUL).",
      point2:
        "Real 4-month case study with the Estoril Praia teams, with measurable improvements in emotional control and decision speed.",
      point3:
        "Real testimonials from elite athletes and business leaders, already validated on this platform.",
      ctaLabel: "Learn more about the scientific method",
    },
    shared: {
      problemFacts: [
        {
          title: "Presenteeism",
          stat: "57 work days lost/year",
          detail: "60% of employees affected",
        },
        {
          title: "Absenteeism",
          stat: "17.5% of sick leaves due to mental health",
          detail: "43.3 days/year on average",
        },
        {
          title: "Turnover",
          stat: "Costs up to 2.3x more than providing support",
          detail: "Turnover reduction up to 60%",
        },
      ],
      clientsLoveHeading: "Clients Love It",
      goToTestimonial: "Go to {name}'s testimonial",
      partnersHeading: "Supported by",
    },
    science: {
      eyebrow: "Science",
      title: "The neuroscience behind Neroes",
      subtitle:
        "The Neroes Mental Training Platform™ would be impossible without extensive research and validated studies about mental health and its effects on human performance.",
      pillars: [
        {
          title: "EEG signal capture",
          desc: "A wearable electroencephalography (EEG) headset reads the brain's electrical activity in real time.",
        },
        {
          title: "Neurofeedback training",
          desc: "Those signals control a videogame that can only be won by genuinely reaching a calmer, more focused state of mind.",
        },
        {
          title: "Measured progress",
          desc: "Adaptive algorithms track each user's evolution across sessions, making training more demanding as skills improve.",
        },
      ],
      statsHeading: "Results observed in corporate teams",
      statsLabels: ["Emotional Control", "Decision Making Velocity", "Self-confidence", "Anxiety"],
      sportCtaText: "Curious how this works for elite sports teams instead?",
      sportCtaButton: "See the Sport Science case study",
    },
    brainExperience: {
      title: "THE BRAIN EXPERIENCE™",
      subtitleHeading: "1-Day Mental Health Event for Corporate",
      description:
        "This 1-day corporate event allows up to 20 employees to have an individual experience that lasts for 30 minutes. Each experience is comprised of 2 parts: Drive with Your Mind / Brain Training Demo.",
      ctaButton: "Schedule Brain Experience",
      videoHeading: "Even Rock in Rio wanted to try!",
      statsLabels: ["People Experienced", "Corporations", "Promoter Score"],
    },
    about: {
      eyebrow: "Who we are",
      title: "About Neroes",
      visionEyebrow: "Our vision",
      visionTitle: "Our vision: human empowerment",
      visionIntro:
        "Neroes started as an idea developed by Pedro Pestana and Hugo Ferreira while working at the Faculty of Sciences of the University of Lisbon. They both bring a passion for human performance and the desire to use scientific and technological knowledge in service of human empowerment.",
      teamEyebrow: "The people",
      teamTitle: "Our Team",
      teamIntro:
        "We are driven to explore human potential, in a perfect harmony between emotion and logic since our team skills match perfectly the needs of the project: neuroscience, psychology, videogame and software development, data analytics, and translation of academic knowledge into business.",
      partnershipsEyebrow: "Working together",
      partnershipsTitle: "Partnerships",
      testimonialsTitle: "What people say about us",
      testimonialQuote:
        "The goal of the game is simple and clear: focus and focus better, eliminating anxiety. And the game hits that goal.",
      testimonialAuthor: "— Inês, 21 years old",
      ctaButton: "Talk to us!",
    },
    contact: {
      eyebrow: "Contact",
      title: "Welcome. We are happy to hear from you",
      subtitle:
        "Questions about the platform, the science, or a live demo — send us a message and we will get back to you shortly.",
      infoHeading: "Contact Information",
      emailLabel: "Email",
      phoneLabel: "Phone",
      addressLabel: "Headquarters",
      address: "Rua da Prata 80, 5th floor, Lisbon, Portugal",
      form: {
        nameLabel: "Name *",
        emailLabel: "Email *",
        phoneLabel: "Phone",
        messageLabel: "Message",
        gdprPrefix: "I agree to the processing of my personal data as described in the ",
        gdprLink: "Privacy Policy",
        gdprSuffix: ". *",
        submitLabel: "Send Message",
        submittingLabel: "Sending...",
        successMessage: "Thank you. Your message has been sent successfully. We will get back to you shortly.",
        errorFallback:
          "Something went wrong. Please try again or email us directly at info@neroes.tech.",
        nameError: "Name is required",
        emailError: "Invalid email address",
        gdprError: "You must accept the privacy policy",
      },
    },
    calculator: {
      eyebrow: "Calculator",
      title: "Mental Health Economy - Corporate Calculator",
      subtitle: "Discover the hidden costs of poor mental health in your company.",
      form: {
        industryLabel: "Industry / Sector",
        industries: [
          "Healthcare",
          "Finance",
          "Technology",
          "Retail",
          "Manufacturing",
          "Education",
          "Government",
          "Hospitality",
          "Legal",
          "Media & Entertainment",
          "Transportation",
          "Construction",
          "Energy & Utilities",
          "Professional Services",
          "Other",
        ],
        employeesLabel: "Number of Employees",
        employeesError: "Must have at least 1 employee",
        salaryLabel: "Annual Average Salary in EUR (optional)",
        salaryHint: "Defaults to €35,000 if left empty",
        submitLabel: "Calculate Cost",
        placeholderText: "Enter your company details to see the hidden financial impact of poor mental health.",
        totalHeading: "Total Estimated Annual Cost",
        presenteeismLabel: "Presenteeism",
        presenteeismDesc: "20% productivity loss",
        absenteeismLabel: "Absenteeism",
        absenteeismDesc: "17.5% sick leaves",
        turnoverLabel: "Turnover",
        turnoverDesc: "15% of annual payroll cost",
      },
      bottomQuote1: "For every 1€ spent in mental health, corporates have a 5€ ROI.",
      bottomQuote1Author: "— Deloitte, Mental Health & Employees Report 2024",
      bottomQuote2:
        "Globally, an estimated 12 billion working days are lost every year to depression and anxiety at a cost of US$ 1 trillion per year.",
      bottomQuote2Author: "— World Health Organization",
      ctaButton1: "Find out how to solve this problem",
      ctaButton2: "Know more about our solution",
    },
    mentalScore: {
      badge: "Neural Performance Simulator",
      heading: "Demo — not a clinical diagnosis",
      description:
        "Adjust the sliders to simulate your progress on each indicator, up to the maximum gain already documented in our case studies. The score combines the four indicators with the weighting used in our internal telemetry dashboard.",
      biomarkerLabels: ["Emotional Control", "Decision Velocity", "Self-confidence", "Anxiety Reduction"],
      weightPrefix: "up to",
      weightMiddle: "· weight",
      scoreLabel: "Mental Score",
      disclaimer:
        "Illustrative simulation based on average gains documented in Neroes case studies. Does not replace professional clinical or psychological assessment.",
    },
  },
};
