export type Locale = "pt" | "en";

interface NamedItem {
  title: string;
  desc: string;
}

/** A figure shown as the Hero's brain dissolves into data (Ato IV). */
interface HeroKpi {
  value: string;
  label: string;
}

/** A step in the sense → train → measure loop. */
interface LoopStep {
  index: string;
  title: string;
  desc: string;
}

/** A published result: the figure, what it measures, and how. Text may use **bold**. */
interface Study {
  value: string;
  desc: string;
  method: string;
}

interface Stage {
  label: string;
  title: string;
  desc: string;
}

interface Right {
  code: string;
  title: string;
  desc: string;
}

interface SciencePillar {
  title: string;
  desc: string;
}

export interface Translations {
  nav: {
    home: string;
    science: string;
    about: string;
    contact: string;
    schedule: string;
    skipToContent: string;
    openMenu: string;
    closeMenu: string;
  };
  home: {
    heroHeadlineLine1: string;
    heroHeadlineLine2: string;
    heroSubtitle: string;
    heroPrimaryCta: string;
    heroSecondaryCta: string;
    heroHudBiosignals: string;
    heroHudActive: string;
    heroHudAnxiety: string;
    heroHudAnxietySource: string;
    heroKpis: [HeroKpi, HeroKpi, HeroKpi];
    heroScrollHint: string;
    platform: {
      eyebrow: string;
      title: string;
      lead: string;
      steps: [LoopStep, LoopStep, LoopStep];
      networks: string;
      techLabel: string;
      tech: string[];
      techNote: string;
      videoCaption: string;
      videoPlayLabel: string;
      videoPause: string;
      videoResume: string;
      videoFallback: string;
      beyond: string;
    };
    where: {
      eyebrow: string;
      title: string;
      items: [NamedItem, NamedItem, NamedItem];
    };
    journey: {
      eyebrow: string;
      title: string;
      stages: [Stage, Stage, Stage];
    };
    vision: {
      shiftLabel: string;
      measured: string;
      believed: string;
      note: string;
      title: string;
      body: string;
      quote: string;
      quoteCaption: string;
      pillars: [NamedItem, NamedItem, NamedItem];
    };
    founders: {
      eyebrow: string;
      title: string;
      pedroRole: string;
      pedroMission: string;
      pedroPersonal: string;
    };
    neurorights: {
      eyebrow: string;
      title: string;
      body: string;
      rights: [Right, Right, Right, Right];
    };
    closing: {
      ground: string;
      sky: string;
      body: string;
      primary: string;
    };
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
  shared: {
    clientsLoveHeading: string;
    goToTestimonial: string;
    partnersHeading: string;
    /** Shared by the Home and the Science page, so the figures never diverge. */
    evidence: {
      eyebrow: string;
      title: string;
      leadValue: string;
      leadLabel: string;
      leadSource: string;
      studies: [Study, Study, Study];
      honestTitle: string;
      honestBody: string;
      liveTitle: string;
      liveBody: string;
    };
  };
  /** src/app/error.tsx — shown when a page fails to render. */
  errorPage: {
    title: string;
    body: string;
    retry: string;
  };
  science: {
    eyebrow: string;
    title: string;
    subtitle: string;
    pillars: [SciencePillar, SciencePillar, SciencePillar];
    statsHeading: string;
    sportCtaText: string;
    sportCtaButton: string;
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
}

// Full-site PT/EN dictionary: Navbar, Footer, Home, Science, About and Contact.
export const translations: Record<Locale, Translations> = {
  pt: {
    nav: {
      home: "Início",
      science: "Ciência",
      about: "Sobre",
      contact: "Contacto",
      schedule: "Marcar uma demonstração",
      skipToContent: "Saltar para o conteúdo",
      openMenu: "Abrir menu",
      closeMenu: "Fechar menu",
    },
    home: {
      heroHeadlineLine1: "Treinamos o cérebro",
      heroHeadlineLine2: "como treinas o corpo.",
      heroSubtitle:
        "Um headset EEG lê as tuas ondas cerebrais enquanto jogas um jogo que só se ganha mantendo a calma e a concentração — treinando foco, controlo emocional e resiliência, sessão após sessão.",
      heroPrimaryCta: "Ver a evidência",
      heroSecondaryCta: "Falar connosco",
      heroHudBiosignals: "Biossinais em tempo real",
      heroHudActive: "Ativo",
      heroHudAnxiety: "Redução média da ansiedade",
      heroHudAnxietySource: "3 clientes · 8+ sessões",
      heroKpis: [
        { value: "+21,7%", label: "Processamento de informação" },
        { value: "+18,8%", label: "Tomada de decisão" },
        { value: "+9,4%", label: "Autoconfiança" },
      ],
      heroScrollHint: "Desliza para ver",
      platform: {
        eyebrow: "02 — A plataforma",
        title: "Um circuito fechado entre o teu cérebro e um jogo.",
        lead: "Não invasivo. Adaptativo. Para jogares bem, aprendes a conduzir o teu próprio estado — **mais calmo, mais atento, mais equilibrado** — enquanto biomarcadores objetivos registam a mudança.",
        steps: [
          { index: "I", title: "Sentir", desc: "Um headset EEG e biossensores leem o teu estado várias vezes por segundo." },
          {
            index: "II",
            title: "Treinar",
            desc: "Um jogo reage ao teu cérebro em tempo real e uma IA adaptativa ajusta o desafio a ti. Regulares-te é a forma de ganhar.",
          },
          {
            index: "III",
            title: "Medir",
            desc: "Sinais cerebrais objetivos acompanhados ao longo do tempo — uma evolução que tu e um clínico conseguem ver.",
          },
        ],
        networks:
          "Lê e treina as redes cerebrais mais relevantes para o teu objetivo — **calma, foco ou desempenho**. Nenhuma região isolada, nenhum marcador único.",
        techLabel: "Tecnologia",
        tech: ["Sensores e biomarcadores", "BCI", "IA adaptativa", "Jogos controlados pelo cérebro", "Respiração e estímulos audiovisuais"],
        techNote: "+ investigação protegida em neuromodulação, descrita apenas em termos gerais",
        videoCaption: "Headset Neroes",
        videoPlayLabel: "Ver com som, em ecrã inteiro",
        videoPause: "Pausar",
        videoResume: "Reproduzir",
        videoFallback: "O teu navegador não suporta vídeo HTML5.",
        beyond:
          "O mesmo circuito vai além da ansiedade — incluindo investigação em fase inicial sobre declínio cognitivo e envelhecimento saudável. **Não é um produto, nem um resultado comprovado:** é uma linha de investigação séria.",
      },
      where: {
        eyebrow: "04 — Contextos",
        title: "Onde funciona hoje",
        items: [
          {
            title: "Clínica",
            desc: "Treino sem medicação para a ansiedade e a regulação emocional — uma ferramenta de apoio, a par do acompanhamento clínico.",
          },
          {
            title: "Desporto",
            desc: "Tomada de decisão, velocidade de processamento e compostura — validado com atletas profissionais e de elite.",
          },
          {
            title: "Trabalho",
            desc: "Foco sustentado e resiliência para equipas sob grande exigência — feedback em vez de suposições.",
          },
        ],
      },
      journey: {
        eyebrow: "05 — O percurso",
        title: "Cada etapa conquista a seguinte.",
        stages: [
          {
            label: "Hoje",
            title: "Aliviar",
            desc: "Ansiedade mensuravelmente mais baixa, equilíbrio restabelecido — a caminho da certificação clínica.",
          },
          {
            label: "A seguir",
            title: "Potenciar",
            desc: "De recuperar uma linha de base a superá-la — foco, decisões, velocidade, resiliência.",
          },
          {
            label: "A fronteira — assumida como visão",
            title: "Explorar",
            desc: "Os estados mais profundos da consciência humana — tornados mensuráveis e treináveis.",
          },
        ],
      },
      vision: {
        shiftLabel: "Mudança de registo",
        measured: "Tudo acima desta linha é medido.",
        believed: "Tudo abaixo dela é aquilo em que acreditamos.",
        note: "Visão e filosofia — nunca alegações clínicas",
        title: "A nossa estrela-guia é a consciência humana.",
        body: "A mesma tecnologia que acalma a ansiedade pode ajudar as pessoas a alcançar os estados de foco profundo, clareza e ligação que as tradições contemplativas descrevem há milhares de anos. Sem os reduzir a nada, sem os tornar místicos — tornando-os alcançáveis.",
        quote:
          "Conseguimos medir o estado cerebral de calma profunda ou de autotranscendência, e ajudar alguém a alcançá-lo de forma fiável. O que isso significa para cada pessoa é seu.",
        quoteCaption: "A ponte honesta entre a nossa ciência e a nossa visão",
        pillars: [
          { title: "Estados expandidos", desc: "Meditação, flow e deslumbramento — medidos e treináveis quando precisas." },
          { title: "Significado e ligação", desc: "A clareza e a ligação que se sentem nos limites da experiência comum." },
          {
            title: "Potencial humano",
            desc: "Atenção, intuição, equanimidade — capacidades que a maioria de nós nunca treina, e poderia treinar.",
          },
        ],
      },
      founders: {
        eyebrow: "06 — Fundador",
        title: "Neurotecnologia rigorosa numa mão. As profundezas da mente na outra.",
        pedroRole: "Fundador",
        pedroMission:
          "A missão do Pedro, nas suas palavras, é **despoletar a excelência** — uma carreira a juntar neurofeedback, IA, interfaces cérebro-computador, EEG e ciência de dados para potenciar a mente humana, com três startups fundadas antes desta.",
        pedroPersonal:
          "E é pessoal: pratica meditação e visualização todos os dias e estuda a consciência há toda a vida. **A Neroes é onde as duas linhas se encontram.**",
      },
      neurorights: {
        eyebrow: "07 — Neurodireitos",
        title: "A mente é o lugar mais privado que existe.",
        body: "Os dados neurais são os dados mais sensíveis que existem. Construímos segundo o primeiro padrão ético global da neurotecnologia — o da UNESCO — desde a conceção, não como remendo.",
        rights: [
          { code: "R.01", title: "Privacidade mental", desc: "Protegida desde a conceção — nunca usada para criar perfis ou manipular." },
          { code: "R.02", title: "Consentimento explícito", desc: "Decides o que é medido e porquê — em linguagem simples." },
          { code: "R.03", title: "Propriedade dos dados", desc: "Os teus dados cerebrais são teus — acede-lhes e apaga-os." },
          { code: "R.04", title: "Sem venda de dados neurais", desc: "Nunca. A confiança é o produto." },
        ],
      },
      closing: {
        ground: "A evidência é o chão.",
        sky: "A visão é o céu.",
        body: "Não pedimos a ninguém que acredite. Medimos — e o que isso significa é teu.",
        primary: "Falar connosco",
      },
    },
    footer: {
      tagline: "Treino mental com neurofeedback por EEG, para clínica, desporto e trabalho.",
      subtagline: "A Neroes é uma plataforma de treino e investigação — não um tratamento médico.",
      navigationHeading: "Navegação",
      legalHeading: "Legal",
      contactHeading: "Contacto",
      emailLabel: "Email",
      phoneLabel: "Telefone",
      addressLabel: "Localização",
      address: "Lisboa, Portugal",
      privacyPolicy: "Política de Privacidade",
      termsConditions: "Termos e Condições",
      copyright: "Todos os direitos reservados.",
    },
    shared: {
      clientsLoveHeading: "O que dizem clientes e atletas",
      goToTestimonial: "Ir para o testemunho de {name}",
      partnersHeading: "Com o apoio de",
      evidence: {
        eyebrow: "03 — A evidência",
        title: "Não descrevemos resultados. Medimo-los.",
        leadValue: "−41%",
        leadLabel: "redução média dos sintomas de ansiedade",
        leadSource: "Média de 3 clientes — CCA Law Firm, Metro Lisboa e Bayer · 8+ sessões · 30 min de treino por semana",
        studies: [
          {
            value: "+21,7%",
            desc: "processamento de informação mais rápido e **+9,4% de autoconfiança** — equipa desportiva profissional, intervenção vs. controlo.",
            method: "N=32 · BAI, CSAI-2, Torre de Londres, D2 · Wilcoxon e Kruskal-Wallis",
          },
          {
            value: "+18,8%",
            desc: "na tomada de decisão, com **25% mais decisões ótimas** — piloto em desporto de elite.",
            method: "N=10 · 30 sessões",
          },
          {
            value: "−62%",
            desc: "de ansiedade, **+10,6% de precisão de atenção** e 31% menos movimentos desperdiçados — caso intensivo, atleta de elite olímpica.",
            method: "Caso individual · EEG + avaliação psicológica",
          },
        ],
        honestTitle: "Dito com honestidade",
        honestBody:
          "Evidência em fase inicial: amostras pequenas, pilotos, casos individuais. Estão em curso ensaios controlados e longitudinais maiores, a caminho da certificação clínica. **Hoje, a Neroes é uma plataforma de treino e investigação — não um tratamento médico.**",
        liveTitle: "E demonstrável, ao vivo",
        liveBody:
          "Numa sessão, vês o teu próprio sinal de regulação a mexer à medida que acalmas a mente. **Um avião no ar, não uma promessa.**",
      },
    },
    errorPage: {
      title: "Algo correu mal ao abrir esta página.",
      body: "Tenta outra vez. Se o problema continuar, escreve-nos para info@neroes.tech.",
      retry: "Tentar outra vez",
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
      statsHeading: "Resultados medidos até agora",
      sportCtaText: "Tens curiosidade sobre como isto funciona em equipas de desporto de elite?",
      sportCtaButton: "Ver o caso de estudo de Ciência do Desporto",
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
      addressLabel: "Localização",
      address: "Lisboa, Portugal",
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
  },
  en: {
    nav: {
      home: "Home",
      science: "Science",
      about: "About",
      contact: "Contact",
      schedule: "Schedule a demo",
      skipToContent: "Skip to main content",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    home: {
      heroHeadlineLine1: "We train the brain",
      heroHeadlineLine2: "like you train the body.",
      heroSubtitle:
        "An EEG headset reads your brainwaves while you play a game that's only won by staying calm and focused — training focus, emotional control, and resilience, session after session.",
      heroPrimaryCta: "See the evidence",
      heroSecondaryCta: "Talk to us",
      heroHudBiosignals: "Real-time biosignals",
      heroHudActive: "Active",
      heroHudAnxiety: "Average anxiety reduction",
      heroHudAnxietySource: "3 clients · 8+ sessions",
      heroKpis: [
        { value: "+21.7%", label: "Information processing" },
        { value: "+18.8%", label: "Decision-making" },
        { value: "+9.4%", label: "Self-confidence" },
      ],
      heroScrollHint: "Scroll to explore",
      platform: {
        eyebrow: "02 — The platform",
        title: "A closed loop between your brain and a game.",
        lead: "Non-invasive. Adaptive. To play well, you learn to steer your own state — **calmer, sharper, more balanced** — while objective biomarkers record the change.",
        steps: [
          { index: "I", title: "Sense", desc: "An EEG headset and biosensors read your state many times per second." },
          {
            index: "II",
            title: "Train",
            desc: "A game reacts to your brain in real time; adaptive AI tunes the challenge to you. Regulating yourself is how you win.",
          },
          {
            index: "III",
            title: "Measure",
            desc: "Objective brain signals are tracked over time — improvement you and a clinician can see.",
          },
        ],
        networks:
          "It reads and trains the brain networks most relevant to your goal — **calm, focus, or performance**. No single region, no single marker.",
        techLabel: "Technology",
        tech: ["Sensing & biomarkers", "BCI", "Adaptive AI", "Brain-driven games", "Breathing & audiovisual aids"],
        techNote: "+ protected neuromodulation research, described in general terms only",
        videoCaption: "The Neroes headset",
        videoPlayLabel: "Watch with sound, full screen",
        videoPause: "Pause",
        videoResume: "Play",
        videoFallback: "Your browser doesn't support HTML5 video.",
        beyond:
          "The same loop reaches beyond anxiety — including early-stage research into cognitive decline and healthy aging. **Not a product, and not a proven outcome:** a direction of serious research.",
      },
      where: {
        eyebrow: "04 — Contexts",
        title: "Where it works today",
        items: [
          {
            title: "Clinic",
            desc: "Drug-free training for anxiety and emotional regulation — a support tool alongside care.",
          },
          {
            title: "Sport",
            desc: "Decision-making, processing speed, and composure — validated with professional and elite athletes.",
          },
          {
            title: "Work",
            desc: "Sustained focus and resilience for high-demand teams — feedback instead of guesswork.",
          },
        ],
      },
      journey: {
        eyebrow: "05 — The journey",
        title: "Each stage earns the next.",
        stages: [
          {
            label: "Today",
            title: "Relieve",
            desc: "Measurably lower anxiety, restore balance — on the path toward clinical certification.",
          },
          {
            label: "Next",
            title: "Enhance",
            desc: "From restoring a baseline to exceeding it — focus, decisions, speed, resilience.",
          },
          {
            label: "The frontier — held as vision",
            title: "Explore",
            desc: "The deeper states of human consciousness — made measurable and trainable.",
          },
        ],
      },
      vision: {
        shiftLabel: "Register shift",
        measured: "Everything above this line is measured.",
        believed: "Everything below it is believed.",
        note: "Vision and philosophy — never clinical claims",
        title: "Our north star is human consciousness.",
        body: "The same technology that quiets anxiety can help people reach the states of deep focus, clarity, and connection that contemplative traditions have described for thousands of years. Not explained away, not made mystical — made reachable.",
        quote:
          "We can measure the brain-state of deep calm or self-transcendence, and help someone reach it reliably. What it means to them is theirs.",
        quoteCaption: "The honest bridge between our science and our vision",
        pillars: [
          { title: "Expanded states", desc: "Meditation, flow, and awe — measured, trainable on demand." },
          { title: "Meaning and connection", desc: "The clarity and connectedness felt at the edges of ordinary experience." },
          { title: "Human potential", desc: "Attention, intuition, equanimity — capacities most of us never train, and could." },
        ],
      },
      founders: {
        eyebrow: "06 — Founder",
        title: "Rigorous neurotechnology in one hand. The depths of the mind in the other.",
        pedroRole: "Founder",
        pedroMission:
          "Pedro's mission, in his own words, is **to trigger excellence** — a career spent merging neurofeedback, AI, brain-computer interfaces, EEG, and data science to enhance the human mind, with three startups founded before this one.",
        pedroPersonal:
          "And it's personal: a daily practitioner of meditation and visualisation, a lifelong student of consciousness. **Neroes is where the two threads meet.**",
      },
      neurorights: {
        eyebrow: "07 — Neurorights",
        title: "The mind is the most private place there is.",
        body: "Neural data is the most sensitive data there is. We build to neurotechnology's first global ethics standard — UNESCO's — by design, not as an afterthought.",
        rights: [
          { code: "R.01", title: "Mental privacy", desc: "Protected by design — never used to profile or manipulate." },
          { code: "R.02", title: "Explicit consent", desc: "You decide what is measured and why — in plain language." },
          { code: "R.03", title: "Data ownership", desc: "Your brain data is yours — access it, delete it." },
          { code: "R.04", title: "No sale of neural data", desc: "Ever. Trust is the product." },
        ],
      },
      closing: {
        ground: "The evidence is the ground.",
        sky: "The vision is the sky.",
        body: "We don't ask anyone to believe it. We measure it — and what it means is yours.",
        primary: "Talk to us",
      },
    },
    footer: {
      tagline: "EEG neurofeedback mental training for clinic, sport and work.",
      subtagline: "Neroes is a training and research platform — not a medical treatment.",
      navigationHeading: "Navigation",
      legalHeading: "Legal",
      contactHeading: "Contact Us",
      emailLabel: "Email",
      phoneLabel: "Phone",
      addressLabel: "Location",
      address: "Lisbon, Portugal",
      privacyPolicy: "Privacy Policy",
      termsConditions: "Terms and Conditions",
      copyright: "All rights reserved.",
    },
    shared: {
      clientsLoveHeading: "What clients and athletes say",
      goToTestimonial: "Go to {name}'s testimonial",
      partnersHeading: "Supported by",
      evidence: {
        eyebrow: "03 — The evidence",
        title: "We don't describe results. We measure them.",
        leadValue: "−41%",
        leadLabel: "average reduction in anxiety symptoms",
        leadSource: "Average across 3 clients — CCA Law Firm, Metro Lisboa and Bayer · 8+ sessions · 30 min of training per week",
        studies: [
          {
            value: "+21.7%",
            desc: "faster information processing, **+9.4% self-confidence** — professional sports team, intervention vs control.",
            method: "N=32 · BAI, CSAI-2, Tower of London, D2 · Wilcoxon & Kruskal-Wallis",
          },
          {
            value: "+18.8%",
            desc: "growth in decision-making, with **25% more optimal decisions** — elite-sport pilot.",
            method: "N=10 · 30 sessions",
          },
          {
            value: "−62%",
            desc: "anxiety, **+10.6% attention accuracy**, 31% fewer wasted movements — an elite Olympic athlete, intensive case.",
            method: "Single subject · EEG + psychological assessment",
          },
        ],
        honestTitle: "Stated honestly",
        honestBody:
          "Early-stage evidence: small samples, pilots, single-subject cases. Larger controlled and longitudinal trials are underway, on a path toward clinical certification. **Today, Neroes is a training and research platform — not a medical treatment.**",
        liveTitle: "And demonstrable, live",
        liveBody: "In a session you watch your own regulation signal move as you calm your mind. **A plane in the air, not a promise.**",
      },
    },
    errorPage: {
      title: "Something went wrong opening this page.",
      body: "Please try again. If it keeps happening, write to us at info@neroes.tech.",
      retry: "Try again",
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
      statsHeading: "Results measured so far",
      sportCtaText: "Curious how this works for elite sports teams instead?",
      sportCtaButton: "See the Sport Science case study",
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
      addressLabel: "Location",
      address: "Lisbon, Portugal",
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
  },
};
