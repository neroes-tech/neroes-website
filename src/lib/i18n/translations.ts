export type Locale = "pt" | "en";

interface NamedItem {
  title: string;
  desc: string;
}

/** A client or athlete quote, verbatim from the old site (PT is a faithful translation). */
interface Testimonial {
  quote: string;
  name: string;
  role: string;
  /** Only where the affiliation is confirmed. */
  company?: string;
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

export interface Translations {
  nav: {
    home: string;
    contact: string;
    schedule: string;
    skipToContent: string;
    /** aria-label of the main navigation landmark. */
    mainLabel: string;
    /** aria-label of the language switcher group. */
    languageLabel: string;
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
    /** "1 in 8" — the problem, from Pedro's design (8 Oct 2026). Source of the figure to confirm. */
    problem: {
      eyebrow: string;
      value: string;
      body: string;
      line: string;
    };
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
    /** 04 — Serviços, in the team's order: Corporate, Desporto, Clínicas, Educação. */
    where: {
      eyebrow: string;
      title: string;
      items: [NamedItem, NamedItem, NamedItem, NamedItem];
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
      pillars: [NamedItem, NamedItem, NamedItem];
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
    /** aria-label of the footer navigation landmark. */
    navLabel: string;
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
    testimonials: Testimonial[];
    testimonialsPause: string;
    testimonialsPlay: string;
    partnersHeading: string;
    /** The Home's evidence section. */
    evidence: {
      eyebrow: string;
      title: string;
      leadValue: string;
      leadLabel: string;
      leadSource: string;
      studies: [Study, Study, Study];
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
  /** src/app/not-found.tsx */
  notFound: {
    title: string;
    body: string;
    back: string;
  };
  /**
   * Browser-tab titles, applied by LanguageProvider when the visitor switches
   * to English (the Portuguese ones are the routes' own metadata). The legal
   * and /sport pages are English-only, so their metadata titles already fit.
   */
  meta: {
    home: string;
    contact: string;
  };
  /** The Contacto page: scheduling only (Pedro, 30 Sept 2026). */
  contact: {
    eyebrow: string;
    title: string;
    subtitle: string;
    /** Subtitle while no booking link is configured (no calendar on the page). */
    subtitleNoCalendar: string;
    /** Accessible name of the embedded booking calendar. */
    calendarTitle: string;
    /** Under the calendar, for when it doesn't load. */
    calendarFallbackPrefix: string;
    calendarFallbackLink: string;
    /** Shown instead of the calendar while no booking link is configured. */
    noCalendarTitle: string;
    noCalendarBody: string;
    noCalendarEmailButton: string;
    noCalendarSubject: string;
    phoneLabel: string;
    /** Subtitle with the built-in scheduler when no confirmation email goes out. */
    subtitleNoEmail: string;
    /** The built-in booking scheduler (src/components/scheduling). "{n}", "{email}", "{time}" are filled in. */
    scheduler: {
      heading: string;
      prevMonth: string;
      nextMonth: string;
      weekdaysShort: [string, string, string, string, string, string, string];
      legendAvailable: string;
      legendBusy: string;
      legendClosed: string;
      today: string;
      freeOne: string;
      freeMany: string;
      busyDay: string;
      closedDay: string;
      closedReasons: { weekend: string; holiday: string; past: string; beyond: string; closed: string };
      pickDay: string;
      dayBusy: string;
      dayClosed: string;
      lisbonTime: string;
      slotBusy: string;
      slotFree: string;
      noneThisMonth: string;
      loading: string;
      loadError: string;
      retry: string;
      fallbackPrefix: string;
      form: {
        heading: string;
        change: string;
        name: string;
        email: string;
        company: string;
        phone: string;
        message: string;
        optional: string;
        consentBefore: string;
        consentLink: string;
        submit: string;
        submitting: string;
        honeypot: string;
        /** Screen-reader note on links that open a new tab. */
        newTab: string;
      };
      errors: {
        required: string;
        email: string;
        phone: string;
        name: string;
        tooLong: string;
        consent: string;
        summary: string;
        taken: string;
        unavailable: string;
        rate: string;
        emailLimit: string;
        generic: string;
      };
      done: {
        title: string;
        emailSent: string;
        saved: string;
        addGoogle: string;
        downloadIcs: string;
        another: string;
        eventTitle: string;
        eventDescription: string;
      };
      yourTime: string;
      /** Shown on Vercel previews, where the agenda runs as a demo. */
      demoNotice: string;
      demoDone: string;
    };
  };
}

// Full-site PT/EN dictionary: Navbar, Footer, Home and Contact (scheduling).
export const translations: Record<Locale, Translations> = {
  pt: {
    nav: {
      home: "Início",
      contact: "Contacto",
      schedule: "Marcar uma demonstração",
      skipToContent: "Saltar para o conteúdo",
      mainLabel: "Principal",
      languageLabel: "Idioma",
      openMenu: "Abrir menu",
      closeMenu: "Fechar menu",
    },
    home: {
      heroHeadlineLine1: "Treinamos o cérebro",
      heroHeadlineLine2: "como treinas o corpo.",
      // Pedro, 8 Oct 2026: "Neroes reads the brain in real time and trains it — objective feedback instead of guesswork."
      heroSubtitle: "A Neroes lê o cérebro em tempo real e treina-o — feedback objetivo em vez de suposições.",
      heroPrimaryCta: "Ver a evidência",
      heroSecondaryCta: "Falar connosco",
      heroHudBiosignals: "Biossinais em tempo real",
      heroHudActive: "Ativo",
      heroHudAnxiety: "Redução média da ansiedade",
      heroKpis: [
        { value: "+21,7%", label: "Processamento de informação" },
        { value: "+18,8%", label: "Tomada de decisão" },
        { value: "−41%", label: "Ansiedade" },
      ],
      heroScrollHint: "Desliza para ver",
      problem: {
        eyebrow: "O problema",
        value: "1 em 8",
        body: "pessoas no mundo vivem com uma doença mental ou neurológica — enfrentada com ferramentas lentas, autoavaliação subjetiva e treino às escuras.",
        line: "A Neroes torna o invisível mensurável — o treino passa a ser um ciclo com feedback real.",
      },
      platform: {
        eyebrow: "A plataforma",
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
        eyebrow: "Serviços",
        title: "Onde funciona hoje",
        items: [
          {
            title: "Corporate",
            desc: "Foco sustentado e resiliência para equipas sob grande exigência — feedback em vez de suposições.",
          },
          {
            title: "Desporto",
            desc: "Tomada de decisão, velocidade de processamento e compostura — validado com atletas profissionais e de elite.",
          },
          {
            title: "Clínicas",
            desc: "Treino sem medicação para a ansiedade e a regulação emocional — uma ferramenta de apoio, a par do acompanhamento clínico.",
          },
          {
            title: "Educação",
            desc: "Foco, gestão da ansiedade e controlo emocional para estudantes — antes dos exames e ao longo do ano letivo.",
          },
        ],
      },
      journey: {
        eyebrow: "O percurso",
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
        title: "A nossa estrela‑guia é a consciência humana.",
        body: "A mesma tecnologia que acalma a ansiedade pode ajudar as pessoas a alcançar os estados de foco profundo, clareza e ligação que as tradições contemplativas descrevem há milhares de anos. Sem os reduzir a nada, sem os tornar místicos — tornando-os alcançáveis.",
        pillars: [
          { title: "Estados expandidos", desc: "Meditação, flow e deslumbramento — medidos e treináveis quando precisas." },
          { title: "Significado e ligação", desc: "A clareza e a ligação que se sentem nos limites da experiência comum." },
          {
            title: "Potencial humano",
            desc: "Atenção, intuição, equanimidade — capacidades que a maioria de nós nunca treina, e poderia treinar.",
          },
        ],
      },
      neurorights: {
        eyebrow: "Neurodireitos",
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
      tagline: "Treino mental com neurotecnologia.",
      subtagline: "A Neroes é uma plataforma de treino e investigação — não um tratamento médico.",
      navigationHeading: "Navegação",
      navLabel: "Rodapé",
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
      testimonialsPause: "Pausar os testemunhos",
      testimonialsPlay: "Retomar os testemunhos",
      testimonials: [
        {
          quote:
            "O treino da Neroes tem sido extraordinário e melhorou muito a forma como giro o stress. Noto uma melhoria substancial no meu bem-estar, com efeitos positivos na minha atividade profissional.",
          name: "José Faria Machado",
          role: "Gestor de Comunicação",
          company: "Bayer",
        },
        {
          quote: "Uma experiência incrível, que eu nem sabia que era possível! As possibilidades da tecnologia são infinitas.",
          name: "Conguito",
          role: "Humorista, radialista e músico",
          company: "Mega Hits",
        },
        {
          quote:
            "Adorei a minha experiência com a Neroes. É incrível ver um carro mover-se só por passar de um estado de pouca energia para um estado de muita energia.",
          name: "Joana Caetano",
          role: "Gestora de Business Intelligence",
          company: "Novartis",
        },
        {
          quote:
            "O treino mental mudou a pressão que eu punha em cada tarefa que me chegava. Agora consigo focar-me no que é importante, sem gastar stress com as tarefas pendentes.",
          name: "Alice Lobo",
          role: "Gestora de TI",
        },
        {
          quote: "Consegui reduzir internamente o impacto de um problema profissional numa única sessão de treino.",
          name: "Maria João Souto",
          role: "Cofundadora e sócia",
        },
        {
          quote:
            "Com esta abordagem interativa, é mais simples e mais fácil perceber o que é preciso fazer para conseguir resultados em competição.",
          name: "João Crisóstomo",
          role: "Medalha de bronze no Europeu de Judo 2021",
        },
        {
          quote:
            "O objetivo do jogo é simples e claro: focar e focar melhor, eliminando a ansiedade. E o jogo cumpre esse objetivo.",
          name: "Inês",
          role: "21 anos",
        },
        {
          quote:
            "O sistema de pontuação dá uma motivação extra ao jogador, que quer sempre ser melhor. O Asteroids é um exemplo de como a pontuação pode motivar e recompensar a capacidade de controlar a ansiedade e aumentar a concentração e o foco.",
          name: "Luís",
          role: "29 anos",
        },
      ],
      partnersHeading: "Confiados por",
      evidence: {
        eyebrow: "A evidência",
        title: "Não descrevemos resultados. Medimo-los.",
        leadValue: "−41%",
        leadLabel: "redução média dos sintomas de ansiedade",
        leadSource: "Média nos clientes CCA Law Firm, Metro Lisboa e Bayer · 30 min de treino por semana",
        studies: [
          {
            value: "+21,7%",
            desc: "processamento de informação mais rápido e **+9,4% de autoconfiança** — equipa desportiva profissional, intervenção vs. controlo.",
          },
          {
            value: "+18,8%",
            desc: "na tomada de decisão, com **25% mais decisões ótimas** — piloto em desporto de elite.",
          },
          {
            value: "−62%",
            desc: "de ansiedade, **+10,6% de precisão de atenção** e 31% menos movimentos desperdiçados — caso intensivo, atleta de elite olímpica.",
          },
        ],
        liveTitle: "E demonstrável, ao vivo",
        liveBody:
          "Numa sessão, vês o teu próprio sinal de regulação a mexer à medida que acalmas a mente. **Um avião no ar, não uma promessa.**",
      },
    },
    contact: {
      eyebrow: "Contacto",
      title: "Marca uma conversa connosco",
      subtitle:
        "Escolhe o dia e a hora que te dão mais jeito para falarmos sobre a plataforma. A confirmação chega-te por email.",
      subtitleNoCalendar: "Diz-nos que dias e horas te dão jeito e marcamos uma conversa sobre a plataforma.",
      calendarTitle: "Calendário para marcar uma conversa com a Neroes",
      calendarFallbackPrefix: "O calendário não abriu?",
      calendarFallbackLink: "Abrir numa nova janela",
      noCalendarTitle: "Diz-nos quando te dá jeito",
      noCalendarBody:
        "Escreve-nos com dois ou três dias e horas que te deem jeito e respondemos a confirmar a conversa. Também podes ligar-nos.",
      noCalendarEmailButton: "Marcar por email",
      noCalendarSubject: "Marcar uma conversa",
      phoneLabel: "Telefone",
      subtitleNoEmail: "Escolhe o dia e a hora que te dão mais jeito para falarmos sobre a plataforma.",
      scheduler: {
        heading: "Escolhe o dia e a hora",
        prevMonth: "Mês anterior",
        nextMonth: "Mês seguinte",
        weekdaysShort: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
        legendAvailable: "Com horários livres",
        legendBusy: "Ocupado",
        legendClosed: "Sem conversas",
        today: "hoje",
        freeOne: "1 horário livre",
        freeMany: "{n} horários livres",
        busyDay: "ocupado",
        closedDay: "sem conversas",
        closedReasons: {
          weekend: "Fim de semana",
          holiday: "Feriado",
          past: "Já não há horários neste dia",
          beyond: "Ainda não abrimos a agenda para este dia",
          closed: "Sem conversas neste dia",
        },
        pickDay: "Escolhe um dia no calendário para ver os horários.",
        dayBusy: "Este dia está ocupado: todos os horários já estão marcados. Escolhe outro dia.",
        dayClosed: "Não há conversas neste dia.",
        lisbonTime: "Hora de Lisboa",
        slotBusy: "Ocupado",
        slotFree: "livre",
        noneThisMonth: "Já não há horários livres este mês. Vê o mês seguinte.",
        loading: "A carregar a agenda…",
        loadError: "Não foi possível carregar a agenda.",
        retry: "Tentar outra vez",
        fallbackPrefix: "Também podes escrever-nos para",
        form: {
          heading: "Os teus dados",
          change: "Alterar",
          name: "Nome",
          email: "Email",
          company: "Empresa",
          phone: "Telefone",
          message: "Sobre o que queres falar?",
          optional: "opcional",
          consentBefore: "Aceito que a Neroes use estes dados para marcar e confirmar esta conversa, como descrito na",
          consentLink: "Política de Privacidade",
          submit: "Confirmar marcação",
          submitting: "A marcar…",
          honeypot: "Não preencher este campo",
          newTab: "(abre noutro separador)",
        },
        errors: {
          required: "Campo obrigatório.",
          email: "Escreve um email válido, por exemplo nome@empresa.pt.",
          phone: "Escreve um número de telefone válido.",
          name: "Escreve o teu nome.",
          tooLong: "Texto demasiado longo.",
          consent: "Para marcar, tens de aceitar.",
          summary: "Corrige os campos assinalados.",
          taken: "Esse horário acabou de ser marcado por outra pessoa. Escolhe outro.",
          unavailable: "Esse horário já não está disponível. Escolhe outro.",
          rate: "Demasiadas tentativas seguidas. Tenta outra vez daqui a uns minutos.",
          emailLimit: "Já tens conversas marcadas com este email. Para marcar outra, escreve-nos.",
          generic: "Não foi possível concluir a marcação. Tenta outra vez ou escreve-nos para",
        },
        done: {
          title: "Conversa marcada",
          emailSent: "Enviámos a confirmação para {email}.",
          saved: "A tua marcação ficou registada.",
          addGoogle: "Adicionar ao Google Calendar",
          downloadIcs: "Descarregar convite (.ics)",
          another: "Marcar outra conversa",
          eventTitle: "Conversa com a Neroes",
          eventDescription: "Conversa com a Neroes sobre a plataforma.",
        },
        yourTime: "{time} no teu fuso horário",
        demoNotice:
          "Pré-visualização — agenda em modo de demonstração: as marcações não ficam guardadas e não se envia nenhum email.",
        demoDone: "Demonstração: esta marcação não ficou guardada e ninguém recebeu email.",
      },
    },
    errorPage: {
      title: "Algo correu mal ao abrir esta página.",
      body: "Tenta outra vez. Se o problema continuar, escreve-nos para info@neroes.tech.",
      retry: "Tentar outra vez",
    },
    notFound: {
      title: "Página não encontrada",
      body: "A página que procuras não existe ou mudou de sítio.",
      back: "Voltar ao início",
    },
    meta: {
      home: "Neroes — Treino mental com neurofeedback",
      contact: "Contacto — Neroes",
    },
  },
  en: {
    nav: {
      home: "Home",
      contact: "Contact",
      schedule: "Schedule a demo",
      skipToContent: "Skip to main content",
      mainLabel: "Main",
      languageLabel: "Language",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    home: {
      heroHeadlineLine1: "We train the brain",
      heroHeadlineLine2: "like you train the body.",
      heroSubtitle: "Neroes reads the brain in real time and trains it — objective feedback instead of guesswork.",
      heroPrimaryCta: "See the evidence",
      heroSecondaryCta: "Talk to us",
      heroHudBiosignals: "Real-time biosignals",
      heroHudActive: "Active",
      heroHudAnxiety: "Average anxiety reduction",
      heroKpis: [
        { value: "+21.7%", label: "Information processing" },
        { value: "+18.8%", label: "Decision-making" },
        { value: "−41%", label: "Anxiety" },
      ],
      heroScrollHint: "Scroll to explore",
      problem: {
        eyebrow: "The problem",
        value: "1 in 8",
        body: "people worldwide live with a mental or neurological disorder — met with slow tools, subjective self-report, and training in the dark.",
        line: "Neroes makes the invisible measurable — training becomes a loop with real feedback.",
      },
      platform: {
        eyebrow: "The platform",
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
        eyebrow: "Services",
        title: "Where it works today",
        items: [
          {
            title: "Corporate",
            desc: "Sustained focus and resilience for high-demand teams — feedback instead of guesswork.",
          },
          {
            title: "Sport",
            desc: "Decision-making, processing speed, and composure — validated with professional and elite athletes.",
          },
          {
            title: "Clinics",
            desc: "Drug-free training for anxiety and emotional regulation — a support tool alongside care.",
          },
          {
            title: "Education",
            desc: "Focus, anxiety management and emotional control for students — before exams and throughout the school year.",
          },
        ],
      },
      journey: {
        eyebrow: "The journey",
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
        pillars: [
          { title: "Expanded states", desc: "Meditation, flow, and awe — measured, trainable on demand." },
          { title: "Meaning and connection", desc: "The clarity and connectedness felt at the edges of ordinary experience." },
          { title: "Human potential", desc: "Attention, intuition, equanimity — capacities most of us never train, and could." },
        ],
      },
      neurorights: {
        eyebrow: "Neurorights",
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
      tagline: "Mental training with neurotechnology.",
      subtagline: "Neroes is a training and research platform — not a medical treatment.",
      navigationHeading: "Navigation",
      navLabel: "Footer",
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
      testimonialsPause: "Pause the testimonials",
      testimonialsPlay: "Resume the testimonials",
      testimonials: [
        {
          quote:
            "Neroes training has been extraordinary, significantly improving my stress management. I’ve noticed a substantial improvement in my well-being, positively affecting my professional activities.",
          name: "José Faria Machado",
          role: "Communication Manager",
          company: "Bayer",
        },
        {
          quote: "A mind-blowing experience, that I did not know was possible! The number of possibilities with technology are endless.",
          name: "Conguito",
          role: "Humorist, Broadcaster, Musician",
          company: "Mega Hits",
        },
        {
          quote:
            "I loved my Experience with Neroes. It is amazing to see a car move just by changing myself from low energy to a high energy state.",
          name: "Joana Caetano",
          role: "Business Intelligence Manager",
          company: "Novartis",
        },
        {
          quote:
            "The mental training changed the pressure I used to put in every single task that came to me. Now, I can focus in what is important, without dedicating stress to pending tasks.",
          name: "Alice Lobo",
          role: "IT Manager",
        },
        {
          quote: "I managed to internally reduce the impact of a professional problem in just one training session.",
          name: "Maria João Souto",
          role: "Co-Founder & Partner",
        },
        {
          quote:
            "With this interactive approach, it is simpler and easier to figure out what has to be done to achieve results during the sports competition.",
          name: "João Crisóstomo",
          role: "Judo European Bronze Medal 2021",
        },
        {
          quote:
            "The goal of the game is simple and clear: focus and focus better, eliminating anxiety. And the game hits that goal.",
          name: "Inês",
          role: "21 years old",
        },
        {
          quote:
            "The score system offers extra motivation for the player, motivating him to always want to be better. Asteroids are an example of how the score system can motivate and reward a player’s ability to control anxiety and increase concentration / focus.",
          name: "Luís",
          role: "29 years old",
        },
      ],
      partnersHeading: "Trusted by",
      evidence: {
        eyebrow: "The evidence",
        title: "We don't describe results. We measure them.",
        leadValue: "−41%",
        leadLabel: "average reduction in anxiety symptoms",
        leadSource: "Average across clients CCA Law Firm, Metro Lisboa and Bayer · 30 min of training per week",
        studies: [
          {
            value: "+21.7%",
            desc: "faster information processing, **+9.4% self-confidence** — professional sports team, intervention vs control.",
          },
          {
            value: "+18.8%",
            desc: "growth in decision-making, with **25% more optimal decisions** — elite-sport pilot.",
          },
          {
            value: "−62%",
            desc: "anxiety, **+10.6% attention accuracy**, 31% fewer wasted movements — an elite Olympic athlete, intensive case.",
          },
        ],
        liveTitle: "And demonstrable, live",
        liveBody: "In a session you watch your own regulation signal move as you calm your mind. **A plane in the air, not a promise.**",
      },
    },
    contact: {
      eyebrow: "Contact",
      title: "Book a conversation with us",
      subtitle:
        "Pick the day and time that suit you best to talk about the platform. The confirmation arrives by email.",
      subtitleNoCalendar: "Tell us which days and times suit you and we'll book a conversation about the platform.",
      calendarTitle: "Calendar to book a conversation with Neroes",
      calendarFallbackPrefix: "Calendar didn't load?",
      calendarFallbackLink: "Open it in a new window",
      noCalendarTitle: "Tell us when suits you",
      noCalendarBody:
        "Write to us with two or three days and times that work for you and we'll reply to confirm the conversation. You can also call us.",
      noCalendarEmailButton: "Book by email",
      noCalendarSubject: "Book a conversation",
      phoneLabel: "Phone",
      subtitleNoEmail: "Pick the day and time that suit you best to talk about the platform.",
      scheduler: {
        heading: "Pick a day and time",
        prevMonth: "Previous month",
        nextMonth: "Next month",
        weekdaysShort: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        legendAvailable: "Free times",
        legendBusy: "Fully booked",
        legendClosed: "No conversations",
        today: "today",
        freeOne: "1 free time",
        freeMany: "{n} free times",
        busyDay: "fully booked",
        closedDay: "no conversations",
        closedReasons: {
          weekend: "Weekend",
          holiday: "Public holiday",
          past: "No times left on this day",
          beyond: "This day isn't open for booking yet",
          closed: "No conversations on this day",
        },
        pickDay: "Pick a day in the calendar to see the times.",
        dayBusy: "This day is fully booked: every time is taken. Please pick another day.",
        dayClosed: "There are no conversations on this day.",
        lisbonTime: "Lisbon time",
        slotBusy: "Booked",
        slotFree: "free",
        noneThisMonth: "No free times left this month. See next month.",
        loading: "Loading the calendar…",
        loadError: "The calendar couldn't be loaded.",
        retry: "Try again",
        fallbackPrefix: "You can also write to us at",
        form: {
          heading: "Your details",
          change: "Change",
          name: "Name",
          email: "Email",
          company: "Company",
          phone: "Phone",
          message: "What would you like to talk about?",
          optional: "optional",
          consentBefore: "I agree that Neroes uses these details to book and confirm this conversation, as described in the",
          consentLink: "Privacy Policy",
          submit: "Confirm booking",
          submitting: "Booking…",
          honeypot: "Leave this field empty",
          newTab: "(opens in a new tab)",
        },
        errors: {
          required: "Required.",
          email: "Enter a valid email, e.g. name@company.com.",
          phone: "Enter a valid phone number.",
          name: "Enter your name.",
          tooLong: "Too long.",
          consent: "Please agree in order to book.",
          summary: "Please fix the highlighted fields.",
          taken: "Someone just booked that time. Please pick another.",
          unavailable: "That time is no longer available. Please pick another.",
          rate: "Too many attempts in a row. Please try again in a few minutes.",
          emailLimit: "You already have conversations booked with this email. To book another, please write to us.",
          generic: "The booking couldn't be completed. Please try again or write to us at",
        },
        done: {
          title: "Conversation booked",
          emailSent: "We've sent the confirmation to {email}.",
          saved: "Your booking has been saved.",
          addGoogle: "Add to Google Calendar",
          downloadIcs: "Download invite (.ics)",
          another: "Book another conversation",
          eventTitle: "Conversation with Neroes",
          eventDescription: "Conversation with Neroes about the platform.",
        },
        yourTime: "{time} in your time zone",
        demoNotice: "Preview — the calendar is in demo mode: bookings aren't saved and no email is sent.",
        demoDone: "Demo: this booking wasn't saved and no one was emailed.",
      },
    },
    errorPage: {
      title: "Something went wrong opening this page.",
      body: "Please try again. If it keeps happening, write to us at info@neroes.tech.",
      retry: "Try again",
    },
    notFound: {
      title: "Page not found",
      body: "The page you're looking for doesn't exist or has moved.",
      back: "Back to home",
    },
    meta: {
      home: "Neroes — Mental training with neurofeedback",
      contact: "Contact — Neroes",
    },
  },
};
