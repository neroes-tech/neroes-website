# Auditoria de conteúdo e UX — site WordPress atual

> Base para o redesign no Replit e para a integração aqui. Fonte: leitura direta de 23 ficheiros HTML em `_referencia/wordpress/` (export estático do WordPress). Nenhum código de produção foi alterado para produzir este documento.

## 1. Sumário — o que mais importa

- **Navegação**: coexistem 3 sistemas de header/footer diferentes (corporate, sport, tema WordPress por defeito), mais um quarto híbrido com dois menus empilhados em `/neroes-home/about-us/`. Nenhuma página tem um `<h1>` fiável — os widgets Elementor imprimem tudo como `<h2>`.
- **Links partidos**: dezenas de links internos apontam para um prefixo `/new/…` (ex.: `/new/contacts/`, `/new/about-us/`) que não corresponde a nenhum caminho real — quase de certeza 404 em produção.
- **Duplicação**: calculadora de saúde mental existe em `/corporate/mental-health-calculator/` e `/mhc/`, byte-a-byte idênticas; `/sport/services/` repete ~70% da homepage Sport; os mesmos 5 testemunhos aparecem copiados na homepage e em Brain Experience.
- **Dados inconsistentes**: 3 moradas diferentes, 2 nomes de entidade legal (*NEROES, LDA* vs. *neroes S.A.*), 2 domínios de email (`.tech` vs `.pt`, incluindo um provável typo `eneroes.tech`) e 2 números de telefone consoante a página.
- **Formulários**: nenhum dos 5 formulários Contact Form 7 tem `<label>` associada aos campos; consentimento RGPD modelado como duas checkboxes independentes "Yes"/"No" (não mutuamente exclusivas).
- **Imagens**: heróis, testemunhos, logótipos de parceiros e 6 de 7 fotos de equipa em `/sport/aboutus/` têm `alt=""` ou `alt` igual ao nome do ficheiro.
- **Página Team**: `/team/` não tem nenhuma fotografia — os 6 cartões são texto puro, apesar da classe CSS `img-equipa` sugerir que fotos estavam planeadas.
- **Multilingue**: TranslatePress ativo, com fugas — `lang="pt-PT"` e `aria-label` em português dentro de formulários servidos na versão inglesa; breadcrumb JSON-LD mostra sempre "Início" mesmo em páginas `en-US`.
- **Conteúdo em falta**: `/forms-websummit2024-pt/` depende inteiramente de um formulário HubSpot injetado por JavaScript (portal `144369137`, form `b0e3d482-9b55-4006-85b9-21ff5fc04ce9`) — nenhum campo é recuperável do HTML estático.
- **"Schedule a meeting" sem calendário**: apesar do nome, não há nenhum widget de calendário — é só um formulário de contacto genérico.

## 2. Inventário de páginas

### Cluster Corporate (institucional, inglês, mega-menu próprio)

| Caminho | Título | Estado | Nota |
|---|---|---|---|
| `/` | home | Manter, reescrever | Homepage institucional B2B; sem H1; testemunhos duplicados com Brain Experience |
| `/corporate/brain-experience/` | Brain Experience | Manter | Página de produto/evento com preço fixo (1500€) e link Calendly externo |
| `/corporate/contact-us/` | Contact Us | Consolidar | Quase duplicada de `/neroes-home/contact-us/` |
| `/corporate/mental-health-calculator/` | Mental Health Calculator | Manter, unificar | Ferramenta funcional; ver duplicação com `/mhc/` |
| `/mhc/` | Mental Health Calculator Landing Page | Fundir com a anterior | Cópia byte-a-byte, só cabeçalho reduzido |
| `/solution/` | Solution | Órfã / decidir | Página legada de 2019, header/footer diferentes de todo o resto |
| `/neroes-home/about-us/` | About Us | Manter | Equipa completa com fotos; secção "Partnerships" duplicada |
| `/neroes-home/contact-us/` | Contact Us | Consolidar | Morada e ano de copyright diferentes da versão corporate |
| `/team/` | Team | Manter, precisa de fotos | 6 membros, zero fotografias |

### Cluster Sport (sub-marca para clubes/atletas, header próprio)

| Caminho | Título | Estado | Nota |
|---|---|---|---|
| `/sport/` | Sport (home) | Manter | Estatísticas de performance, testemunho de atleta, parceiros, prémios |
| `/sport/aboutus/` | About Us Sport | Manter | Equipa com fotos (6 de 7 sem alt); Partnerships duplicada |
| `/sport/science/` | Science Sport | Manter | Caso de estudo Estoril; 2 gráficos de dados sem alt |
| `/sport/services/` | Services Sport | Reescrever | ~70% duplicado da homepage Sport; sem lista concreta de serviços/preços |
| `/sport/contacts/` | Contact Us Sport | Consolidar | Terceira variante de formulário de contacto |

### Cluster Legal & Eventos

| Caminho | Título | Estado | Nota |
|---|---|---|---|
| `/privacy-policy/` | Privacy Policy | Rever com jurídico | 13 secções; dados de contacto/morada inconsistentes |
| `/terms-conditions/` | Terms and Conditions | Rever com jurídico | Heading quebra a meio (H3 → parágrafo a negrito → H4) |
| `/web-summit/` | Web summit | Provavelmente descartável | Landing de sorteio sem data/local do evento |
| `/schedule-a-meeting/` | Schedule a meeting | Reconstruir com calendário real | Nome promete agendamento, entrega formulário genérico |
| `/forms-websummit2024-pt/` | Form WebSummit 2024 PT | Pedir conteúdo ao HubSpot | Página em branco sem JS; formulário 100% via script externo |

### Artefactos de sistema (sem conteúdo a migrar)

`/elementor-hf/corporate/`, `/elementor-hf/general-header/`, `/elementor-hf/sport-header/` — stubs de redirecionamento (`window.location = "/"`). `/2019/07/31/ola-mundo/` — post "Olá, mundo!" por defeito do WordPress, nunca editado; confirma que não existe secção de blog real.

## 3. Conteúdo por página

### Cluster Corporate

**`/` (home)** — Título: `home - Neroes`. Nav: Brain Experience → `/corporate/brain-experience/`, Mental Health Calculator → `/corporate/mental-health-calculator/`, Contact Us → `/corporate/contact-us/`.

> "Would you like to keep the best people in your company? Make them happier while making them better. Give them the tools to be the best version of themselves."

Explica o Mental Training Platform™ (jogo controlado por ondas cerebrais, headset EEG) em três blocos: como funciona, objetivo do jogo, porque é desafiante. Bloco de benefícios: "Organizational health & Better team workers", "Increased Productivity & Reduced mistakes", "Personal development & Happier people".

Estatísticas: **+111%** Emotional Control · **+21,7%** Decision making velocity · **+9,4%** Self-confidence · **-14,2%** Anxiety.

Testemunhos (5, carrossel — repetidos em `/corporate/brain-experience/`): José Faria Machado (Communication Manager), Conguito (Humorist/Broadcaster/Musician), Joana Caetano (Business Intelligence Manager), Alice Lobo (IT Manager), Maria João Souto (Co-Founder & Partner).

CTAs: "Science" → `/sport/science/` · "Know more" → `/new/contacts/` (link quebrado).

Contactos (rodapé): `info@neroes.tech` · `+351 914 796 058` · TecLabs, Faculty of Sciences of the University of Lisbon, Campo Grande, 1749-106 Lisbon · LinkedIn/Instagram/Facebook.

**`/corporate/brain-experience/`** — Meta description copiada da página de contacto (erro). Dois `<h1>` na página, fora de ordem.

> "THE BRAIN EXPERIENCE™ 1-Day Mental Health Event for Corporate" — "This 1-day corporate event allows up to 20 employees to have an individual experience that lasts for 30 minutes... Each experience is comprised of 2 parts: Drive with Your Mind / Brain Training Demo."

Estatísticas: **1034** People Experienced · **96+** Corporations · **92%** Promoter Score. Menção de cliente: *Rock in Rio* (vídeo do YouTube incorporado). Preço fixo: **1500€**, "Cancel for free whenever you want." CTA: "Schedule Brain Experience" → `https://calendly.com/pedro-ebw/brain-experience-event` (Calendly externo, funcional).

**`/corporate/mental-health-calculator/` + `/mhc/`** (duplicadas, mesmo corpo HTML) —

> "Mental Health Economy - Corporate Calculator" — "Discover the hidden costs of poor mental health in your company. Uncover the annual financial impact of low performance and see how much your business is losing."

Ferramenta: formulário com 3 campos — *Industry* (select, 15 setores), *Number of Employees* (obrigatório), *Annual Average Salary in € (Optional)* — botão "Calculate" que corre JS no browser (tabela `industryValues` hardcoded, conversão GBP→EUR ao vivo via `api.frankfurter.app`) e devolve 3 custos: Presenteeism, Absenteeism, Turnover.

Citações-fonte: *"For every 1€ spent in mental health, corporates have a 5€ ROI." – Deloitte, Mental Health & Employees Report 2024* e *"Globally, an estimated 12 billion working days are lost every year to depression and anxiety at a cost of US$ 1 trillion per year." – WHO*.

Estatísticas: **Presenteeism** (57 dias de trabalho perdidos/ano, 60% dos colaboradores afetados) · **Absenteeism** (17,5% das baixas por saúde mental, 43,3 dias/ano em média) · **Turnover** (custo até 2,3x maior; redução de turnover até 60%).

CTAs: "Find out how to solve this problem" e "Know more about our solution" → ambos `/corporate/brain-experience/`.

**`/corporate/contact-us/` + `/neroes-home/contact-us/`** (quase duplicadas) —

> "Welcome. We are happy to hear from you"

Formulário (Contact Form 7): Name, Email, Phone, Message (opcional), consentimento RGPD, botão "SEND MESSAGE".

| | `/corporate/contact-us/` | `/neroes-home/contact-us/` |
|---|---|---|
| Morada | TecLabs, Campo Grande, 1749-106 Lisboa (link Google Maps) | Institute of Biophysics..., Campo Grande – 1749-016 Lisboa (texto simples) |
| Email/telefone | `mailto:`/`tel:` clicáveis | Texto simples, não clicável |
| Copyright | 2024 | 2023 |

**`/neroes-home/about-us/`** —

> "Neroes started as an idea developed by Pedro Pestana and Hugo Ferreira while working at the Faculty of Sciences of the University of Lisbon. They both bring a passion for human performance and the desire to use scientific and technological knowledge in service of human empowerment."

Equipa: Pedro Pestana (CEO), Hugo Ferreira (Lead Scientific Advisor), Valter Costa (Chief Technology Officer), Ana Monteiro (Neurofeedback Advisor), Duarte Rodrigues (Head of Innovation), Rafael Ramos (Software Engineer), Rudy Jeanne (Research & Development Manager).

Parceiros (secção duplicada duas vezes, uma vazia): KPMG, BGI, IPN, IBEB, Faculdade de Ciências da Universidade de Lisboa, Portugal Ventures.

**`/team/`** (sem fotos) —

> "We are driven to explore human potential, in a perfect harmony between emotion and logic since our team skills match perfectly the needs of the project: neuroscience, psychology, videogame and software development, data analytics, and translation of academic knowledge into business."

6 membros sem fotografia: Pedro Pestana (Co-Founder & CEO), Hugo Ferreira (Co-Founder & CMO), Valter Costa (CTO), Mafalda Neves (Graphic Design & Illustration), Ana Monteiro (Psychologist), Rafael Ramos (Game developer). Bios têm erros de espaçamento a rever numa passagem de copy.

Testemunho: *"The goal of the game is simple and clear: focus and focus better, eliminating anxiety."* — Inês, 21 anos.

**`/solution/`** (página legada, 2019 — sem CTA) —

> "High-performance athletes claim mental training is critical for success. Yet, so far, athletes only have access to limited psychology support."

Testemunho: *"The score system offers extra motivation for the player... Asteroids are an example of how the score system can motivate and reward a player's ability to control anxiety."* — Luís, 29 anos.

### Cluster Sport

**`/sport/`** — Nav própria: About Us → `/sport/aboutus/`, Services → `/sport/services/`, Science → `/sport/science/`, Contact Us → `/sport/contacts/`.

> "We all come across athletes that crack under pressure. Stress and anxiety alone are the main reasons for failure by professional athletes. We need to give them tools to better control their own mental performance."

Modelo "4 passos" (carrossel) e "NON-INVASIVE / SELF-PROGRESSING / EASY & AUTONOMOUS".

Estatísticas: **+4%** performance improvement · **21,7%** Faster Decision Making · **9,4%** Self-confidence boost · **-14%** anxiety em 10 sessões (⚠️ em `/sport/services/` a mesma estatística aparece como **7,5%** — confirmar antes de migrar).

Testemunho: *"With this interactive approach, it is simpler and easier to figure out what has to be done to achieve results during the sports competition."* — João Crisóstomo, Judo European Bronze Medal 2021.

Parceiros: KPMG, BGI, IPN, IBEB, FCUL, Portugal Ventures. Prémios: Physioma e Web Summit (ambos com `href="#"` — sem destino real).

**`/sport/aboutus/`** — Equipa: Pedro Pestana (CEO), Hugo Ferreira (Lead Scientific Advisor), Valter Costa (Chief Technology Officer), Ana Monteiro (Neurofeedback Advisor), André Vilela (Head of Operations & Business Development), Rafael Ramos (Software Engineer), Rudy Jeanne (Research & Development Manager). Fotos existem para os 7, mas só a de Pedro Pestana tem `alt` preenchido.

**`/sport/science/`** —

> "The Estoril Team case study — We trained the Estoril A and Estoril sub 23 teams for four months, comparing a control group... After 4 months, results were already visible."

Estatísticas: **+300%** controlo emocional · **+20%** velocidade de processamento · **+9,4%** autoconfiança · **+4%** ações corretas por época. Ilustradas por dois gráficos (`ec.png`, `ecc.png`) sem qualquer texto alternativo.

**`/sport/services/`** (duplicada ~70%) — Repete verbatim o bloco de 3 ícones, o carrossel de 4 passos, o bloco de estatísticas, o bloco de benefícios para clubes e o testemunho de João Crisóstomo já vistos em `/sport/`. Não existe lista concreta de serviços/pacotes/preços.

**`/sport/contacts/`** — Mesmo padrão de formulário CF7 das outras páginas de contacto. Morada: Institute of Biophysics and Biomedical Engineering, Campo Grande – 1749-016 Lisboa. Sem mapa incorporado.

### Cluster Legal & Eventos

**`/privacy-policy/`** — 13 secções: Scope, What is Personal Data, Tipologia/Finalidades, Perfil de Utilizador, Entidade Responsável, Medidas de Segurança e Resposta a Violações, Transferências Internacionais, Acesso e Controlo, Retenção (2 anos inatividade, 10 anos dados de transação), Cookies (tabela: `_ga` 2 anos, `_gid` 24h, `_gat` 1min, `Token`/`Session`/`AWSALB`/`AWSALBCORS`), Contactos, Lei Aplicável, Data da última atualização (11 nov. 2023).

⚠️ Identidade legal a confirmar: NEROES, LDA · NIF 515917915 · sede indicada: Centro Empresarial – Zona Industrial, 6060-182 Idanha-a-Nova — mas o rodapé da mesma página mostra morada diferente (Lisboa, Campo Grande), e outras páginas usam "neroes S.A.". Autoridade de supervisão: CNPD.

**`/terms-conditions/`** — 13 cláusulas: definições, condições de uso, obrigações do utilizador, suspensão/terminação (30 dias para apagar dados após pedido), responsabilidade (isenção explícita de dispositivo médico), propriedade intelectual, lei aplicável.

**`/web-summit/`** (sem conteúdo de evento) —

> "Win a free demonstration — Register to win one of 5 Demo days. Take a chance to experience the power of your brain!"

Sem H1, sem data/local do evento — só o hero e um formulário CF7. Email de contacto no rodapé: `info@neroes.pt` (domínio diferente do resto do site).

**`/schedule-a-meeting/`** (sem calendário) —

> "SCHEDULE A MEETING — WE HAVE A SOLUTION FOR YOUR ATHLETES. We are entirely at your disposal to clarify any doubts."

Formulário CF7 com 6 campos (Name, Email, Phone, Company, Business Area, Message). Testemunho: *"...Asteroids are an example of how the score system can motivate..."* — Luís, 29 anos (repetido de `/solution/`).

**`/forms-websummit2024-pt/`** (conteúdo não recuperável) — Página em branco além de um aviso de compatibilidade de browser. Formulário real injetado via HubSpot (`portalId: 144369137`, `formId: b0e3d482-9b55-4006-85b9-21ff5fc04ce9`) — campos e texto de consentimento têm de ser pedidos à conta HubSpot.

## 4. Problemas de UX/UI, acessibilidade e usabilidade

Severidade reflete impacto na reconstrução, não gravidade legal.

### Estrutura de cabeçalhos e semântica

- **[Crítico]** Sem H1 fiável em quase nenhuma página — o widget "Heading" do Elementor imprime sempre `<h2>`. Afeta `/`, `/neroes-home/about-us/`, `/corporate/brain-experience/`, `/corporate/mental-health-calculator/`, `/mhc/` (estas duas últimas têm dois H1 a meio da página, fora de ordem).
- **[Moderado]** Toda a secção `/sport/*` usa só H2, incluindo a linha de copyright do rodapé.
- **[Moderado]** Saltos de nível de heading em `/corporate/mental-health-calculator/` (H2→H4→H6) e `/terms-conditions/` (H3 → parágrafo a negrito → H4).

### Navegação e arquitetura de informação

- **[Crítico]** Três sistemas de cabeçalho/rodapé diferentes coexistem: mega-menu "corporate", mega-menu "sport", e o cabeçalho/rodapé por defeito do tema WordPress (sem navegação real) em `/solution/` e `/team/`. Em `/neroes-home/about-us/` e `/neroes-home/contact-us/` aparecem dois menus empilhados ao mesmo tempo.
- **[Crítico]** Links internos para um prefixo `/new/…` que não existe (`/new/contacts/`, `/new/about-us/`, `/new/privacy-policy/`, `/new/science/`) — dezenas de ocorrências, quase de certeza 404 em produção.
- **[Menor]** 2 links mortos `href="#"` (logótipos de prémio "Physioma" e "Web Summit" em `/sport/`).
- **[Menor]** IDs de menu duplicados entre o menu desktop e o menu mobile em todas as páginas Sport.

### Formulários

- **[Crítico]** Nenhum campo de formulário tem `<label>` — todos os 5 formulários Contact Form 7 dependem só de placeholder.
- **[Moderado]** Consentimento RGPD modelado como duas checkboxes independentes "Yes"/"No" (podem ficar ambas marcadas ou nenhuma) em vez de um checkbox único obrigatório ou `radiogroup`.
- **[Moderado]** Mensagens de erro/sucesso do Contact Form 7 têm `aria-hidden="true"` — não anunciadas a leitores de ecrã.
- **[Menor]** Campo de telefone com `type="text"` em vez de `type="tel"` (web-summit, schedule-a-meeting, sport/contacts).
- **[Menor]** Campo obrigatório sem indicação visual (asterisco/`aria-required`) na calculadora.

### Imagens e texto alternativo

- **[Crítico]** Gráficos de dados do caso de estudo Estoril (`ec.png`, `ecc.png`) sem qualquer alt text — os números que sustentam a alegação de eficácia ficam invisíveis para leitores de ecrã.
- **[Moderado]** Logótipos de parceiros (KPMG, BGI, IPN, IBEB, FCUL, Portugal Ventures) sempre com `alt=""`.
- **[Moderado]** 6 das 7 fotos de equipa em `/sport/aboutus/` sem alt.
- **[Menor]** Padrão recorrente de alt = nome do ficheiro (`alt="logos_Site_novo2"`, `alt="icon_01"`).
- **[Menor]** Zero fotografias em `/team/` apesar da classe CSS `img-equipa` sugerir que estavam planeadas.

### Conteúdo duplicado ou inconsistente

- **[Crítico]** Dados de contacto divergem por página: 3 moradas, 2 nomes de entidade (*NEROES, LDA* vs. *neroes S.A.*), 2 domínios de email (`@neroes.tech` vs `@neroes.pt`, mais o typo `info@eneroes.tech`), 2 telefones.
- **[Moderado]** Calculadora duplicada byte-a-byte em `/corporate/mental-health-calculator/` e `/mhc/`, incluindo o mesmo bug de conversão de moeda.
- **[Moderado]** Estatística de redução de lesão divergente: 14% (homepage Sport) vs. 7,5% (`/sport/services/`).
- **[Menor]** Os mesmos 5 testemunhos copiados entre `/` e `/corporate/brain-experience/`.

### Multilingue (TranslatePress)

- **[Moderado]** Formulários com `lang="pt-PT"` e `aria-label="Formulário de contacto"` dentro de páginas servidas em `en-US`.
- **[Menor]** Breadcrumb JSON-LD usa sempre "Início" mesmo em páginas `en-US`.

### Links externos, segurança e legal

- **[Menor]** Sem `rel="noopener"` em links `target="_blank"` (ícones sociais, relatórios Deloitte/WHO, CNPD).
- **[Menor]** Links legais/externos em `http://` (CNPD, suporte Google Chrome).

### Código morto e performance

- **[Menor]** Script completo da calculadora carregado em páginas sem os elementos DOM correspondentes (contact-us ×2, web-summit, schedule-a-meeting, forms-websummit2024-pt).
- **[Menor]** Carrosséis com autoplay (3000ms) sem controlo de pausa nem `aria-label` nos botões de navegação.

## 5. Decisões de conteúdo em aberto

Antes de fixar o conteúdo definitivo no redesign:

- Escolher uma única página de contacto por cluster (corporate/sport), não 3 variantes quase idênticas.
- Fechar os dados legais/contacto canónicos: uma morada, um nome de entidade, um domínio de email, um telefone por cluster.
- Decidir o destino de `/solution/` (órfã, 2019) e de `/web-summit/` (sem conteúdo de evento real).
- Pedir à conta HubSpot os campos reais do formulário de `/forms-websummit2024-pt/` (portal `144369137`).
- Decidir se a calculadora de saúde mental passa a ser um componente único em vez de duas cópias mantidas em paralelo.
- Conseguir fotografias reais da equipa para `/team/`.
- Confirmar as estatísticas divergentes (redução de lesão: 14% vs. 7,5%) junto de quem as produziu.
- Se "Schedule a meeting" se mantiver, decidir se passa a ter calendário real (Calendly/Cal.com).

## 6. Conteúdo do design do Pedro Pestana (set. 2026)

Fonte: gravação de ecrã do protótipo `Neroes.dc.html` (claude.ai/design, acesso com login), secções 02–07 + fecho + rodapé. **Só o conteúdo foi usado — não o design.** Aplicado na versão 3 (Início e Ciência), em PT-PT (tradução) e EN (texto original).

- **02 — The Platform:** "A closed loop between your brain and a game." · Non-invasive, adaptive; steer your own state — calmer, sharper, more balanced — while objective biomarkers record the change. Passos: I Sense (EEG + biosensores) · II Train (jogo reage em tempo real, IA adaptativa) · III Measure (sinais objetivos ao longo do tempo). Redes para calm, focus ou performance. Tecnologia: sensing & biomarkers · BCI · adaptive AI · brain-driven games · breathing & audiovisual aids + protected neuromodulation research (termos gerais). Nota: "reaches beyond anxiety — early-stage research into cognitive decline and healthy aging. Not a product, and not a proven outcome."
- **03 — The Evidence:** "We don't describe results. We measure them." · +21.7% information processing e +9.4% self-confidence (equipa desportiva profissional; N=32 · BAI, CSAI-2, Tower of London, D2 · Wilcoxon & Kruskal-Wallis) · +18.8% decision-making, 25% more optimal decisions (piloto desporto de elite; N=10 · 30 sessões) · −62% anxiety, +10.6% attention accuracy, 31% fewer wasted movements (atleta olímpico, caso individual). "Stated honestly": evidência em fase inicial; hoje a Neroes é plataforma de treino e investigação — não tratamento médico. "Demonstrable, live."
- **04 — Where it works today:** Clinic · Sport · Work.
- **05 — The Journey:** "Each stage earns the next." Today: Relieve · Next: Enhance · The frontier (held as vision): Explore.
- **Vision:** "Everything above this line is measured. Everything below it is believed." (vision and philosophy — never clinical claims) · "Our north star is human consciousness." · citação sobre medir estados de calma profunda / autotranscendência · Expanded states · Meaning and connection · Human potential.
- **06 — Founder:** Pedro Pestana — "Rigorous neurotechnology in one hand. The depths of the mind in the other."; missão "to trigger excellence"; três startups anteriores; meditação e visualização diárias.
- **07 — Neurorights:** "The mind is the most private place there is." · padrão ético da UNESCO · R.01 Mental privacy · R.02 Explicit consent · R.03 Data ownership · R.04 No sale of neural data.
- **Fecho:** "The evidence is the ground. The vision is the sky." · Rodapé: "Neroes is a training and research platform — not a medical treatment."

**Decisões da equipa (set. 2026):**
- **−41%** é o valor de ansiedade a usar sempre: impacto médio em 3 clientes (CCA Law Firm, Metro Lisboa, Bayer), 8+ sessões, 30 min de treino por semana. ⚠️ O protótipo do Pedro descreve o −41% como "estudo controlado, N=20, Beck Anxiety Inventory, ~3 h de treino" — alinhar a descrição com o Pedro.
- Substitui os números do site antigo na Início e na Ciência (+111% controlo emocional, −14,2% ansiedade). As páginas `/sport/*` (legado, sem ligação no menu) ainda mostram os números antigos ("até 14% em 10 sessões").
- **Morada:** não publicar por agora (só "Lisboa, Portugal").
- O protótipo apresenta um único fundador; o site mantém os dois cofundadores (Pedro Pestana e Hugo Ferreira), como no inventário original — confirmar.
- Não usado: email `pedro.pestana@neroes.tech` (o contacto canónico é `info@neroes.tech`) e o formulário de newsletter "Follow the journey" (precisa de backend e consentimento RGPD).

**Revisão da versão 3 (29 set. 2026, feedback do Wendell):**
- A Início passa a ter **só o conteúdo do protótipo do Pedro** (secções 02–07 + fecho) e o vídeo do headset. Saíram da Início: a secção "01 — O problema" (custo do stress, do site antigo), "O que a plataforma inclui", os testemunhos de clientes (o componente e os dados continuam no código para reutilizar), o Hugo Ferreira (continua em Sobre) e os CTAs/links que não estavam no protótipo. A gravação do Pedro começa na secção 02 — a hero e uma eventual 01 dele não foram vistas.
- Fundador na Início: só Pedro Pestana, "Fundador", como no protótipo (sem foto — pedir uma ao Pedro).
- **Sem dourado na interface:** o registo "acreditado/visão" passa a itálico no azul da marca; o dourado fica só no logótipo.
- Hero como na versão 2: o cérebro sozinho com o batimento (caixas de biossinais e −41%) e o texto, centrado, a entrar com o scroll; no fim, +21,7% / +18,8% / +9,4% (estudos do protótipo).

**Versão 4 (30 set. 2026, feedback do Wendell e do Pedro):**
- ⚠️ **Testemunhos:** os 5 textos que estavam em `src/lib/constants.ts` (e que a versão 2, em produção, mostra) **não correspondiam ao site antigo** — tinham sido reescritos numa passagem anterior e atribuídos às mesmas pessoas (ex.: "mental clarity needed to excel under pressure" atribuído a José Faria Machado). Substituídos pelos **8 testemunhos originais**, verbatim do export WordPress (`/`, `/team/`, `/solution/`, `/sport/`): José Faria Machado, Conguito, Joana Caetano, Alice Lobo, Maria João Souto, João Crisóstomo, Inês (21 anos), Luís (29 anos). EN = original; PT = tradução fiel. As empresas (Bayer, Mega Hits, Novartis) vêm do mapeamento confirmado pelo Bruno — o site antigo não as mostrava.
- Testemunhos na Início: uma faixa que desliza no capítulo preto, no lugar da antiga galeria de fotos do headset (retirada a pedido do Pedro).
- Parceiros ("Com o apoio de") passam para baixo de "Onde funciona hoje", alinhados com as três colunas.
- Fundador: o título do Pedro dividido em dois painéis que se expandem ao passar o rato — "Neurotecnologia rigorosa numa mão." (o headset) e "As profundezas da mente na outra." (foto do Pedro ao microfone, 481×720 — pedir o original em alta resolução).
- **Formulário de contacto:** o projeto Supabase do `.env.local` já não existe (o domínio não resolve) e o email nunca foi configurado, por isso nenhuma mensagem chegava a lado nenhum (a versão 2 mostrava "enviado" e perdia-a). O email da empresa é Google Workspace: basta `SMTP_USER` + `SMTP_PASS` (palavra-passe de app) — ver `.env.example` e `npm run mail:check`. *(Substituído — a 30 set. o formulário foi removido; ver "Feedback do Pedro" abaixo.)*

**Feedback do Duarte (30 set. 2026):**
- Secção 04 passa a **"04 — Serviços"**, por esta ordem: **Corporate, Desporto, Clínicas, Educação**. ⚠️ A descrição de Educação ("Foco, gestão da ansiedade e controlo emocional para estudantes — antes dos exames e ao longo do ano letivo.") foi escrita agora — o site antigo não tinha nada sobre educação; **confirmar com o Duarte**. O título "Onde funciona hoje" mantém-se (do Pedro); mudar se Educação ainda não estiver ativa.
- "Com o apoio de" → **"Confiados por" / "Trusted by"**. O Duarte vai enviar mais logótipos.
- Painéis do fundador: **"Missão"** (headset, texto da missão do Pedro) e **"Visão"** (foto do Pedro, texto pessoal dele). A frase do Pedro volta a ser o título da secção 06.
- Hero: o cérebro volta às cores da versão 2 (#3B82F6 / #22D3EE / #00F0FF) e ao fundo azul-marinho; o texto entra antes da explosão e não fica por baixo da navegação em ecrãs baixos.

**Feedback do Pedro (chamada de 30 set. 2026, transcrita localmente):**
- **Fundador:** secção retirada da Início ("tira isso do fundador, isso tudo"). Fotos dos painéis apagadas.
- **Rodapé:** "Treino mental com neurotecnologia." — sem "para clínica, desporto e trabalho" ("isto é só sobre a tecnologia").
- **Páginas Ciência e Sobre:** eliminadas ("essa página elimina"); `/science` e `/about` redirecionam para a Início (307). A navegação fica Início · Contacto.
- **Contacto:** sem formulário — só marcação por Calendly ("põe para já um Calendly do André; fala com ele"). O link é configurado em `NEXT_PUBLIC_CALENDLY_URL`. ⚠️ O link antigo (`calendly.com/pedro-ebw/brain-experience-event`, usado no botão "Marcar uma demonstração" até agora) responde **"Este evento está indisponível no momento"** — o botão estava partido. Sem link configurado, a página mostra email e telefone.
- Sem formulário, saem também a API `/api/contact`, o envio por SMTP e as dependências nodemailer, react-hook-form e zod.
- **Para depois:** "pôr uma musiquinha" (ideia da Joana) — se avançar, nunca com autoplay de som (WCAG 1.4.2), só com um botão de play.
- **1 out. 2026 (Wendell):** retirar "3 clientes · 8+ sessões" de todo o site. A caixa da Hero mostra só "Redução média da ansiedade −41%"; a fonte na Evidência passa a "Média nos clientes CCA Law Firm, Metro Lisboa e Bayer · 30 min de treino por semana".
- **6 out. 2026 (Wendell):** logótipo do site passa a "neroes corporate" (ficheiro `wp-content/uploads/2024/10/logo-corporate-horizontal.png` do site antigo), com a barra de navegação branca (o "neroes" azul-escuro não se lê no preto) e a versão negativa (branca) no rodapé, como o manual de marca indica para fundos escuros. Sai a citação da visão ("Conseguimos medir o estado cerebral de calma profunda…" / "A ponte honesta entre a nossa ciência e a nossa visão").
- **6 out. 2026 — Agenda:** a marcação passa a ser uma **agenda de marcações do Google Calendar** embutida no Contacto (mostra os dias e horas livres da agenda real da equipa; o Google envia as confirmações). Configura-se em `NEXT_PUBLIC_BOOKING_URL` (aceita também Calendly). Verificado a 6 out.: o Calendly da Neroes não tem agendas ativas (o evento do Pedro está desligado; a página "neroes" diz "no openings").
- **7 out. 2026 — Agenda própria no Contacto (pedido do Wendell):** em vez de embutir uma agenda externa, o site tem o seu calendário: dias com horários livres, dias ocupados e dias sem conversas; a lista de horários do dia (os marcados aparecem como "Ocupado"); formulário (nome, email, empresa, telefone, mensagem, consentimento RGPD); confirmação com convite. Marcações no Supabase (`docs/sql/bookings.sql`), emails por SMTP do Google Workspace. **A confirmar com a equipa:** o horário de atendimento (por defeito seg–sex, 10:00–13:00 e 14:00–18:00, conversas de 30 min, 12 h de antecedência — em `src/lib/scheduling/availability.ts`) e quem recebe os avisos (por defeito info@neroes.tech).
- **8 out. 2026 — Logótipo:** a pedido do Pedro, volta o logótipo anterior (ícone + "neroes", `public/neroes-logo-lockup.png`) no lugar do "neroes corporate", com a barra de navegação preta como antes.
- **8 out. 2026 — Reunião Pedro / Wendell (Home escura com estrelas):** a explosão do cérebro já não termina numa secção branca — os pontos ficam como campo de estrelas fixo atrás de toda a Home (fundo preto) e o scroll "navega" dentro deles; atividade elétrica nas conexões (algumas douradas, algumas mais fortes) e mais pontos vermelhos. O corpo da Home passa a escuro, ao estilo do Claude Design "Neroes" do Pedro, **sem as ondas** desse design; números grandes e a negrito; vídeo enquadrado; empresas no fim; Neurorights fica; founder continua fora. Subtítulo da hero: "Neroes reads the brain in real time and trains it — objective feedback instead of guesswork." (PT: "A Neroes lê o cérebro em tempo real e treina-o — feedback objetivo em vez de suposições."). Nova secção "1 in 8 / 1 em 8" (texto do design do Pedro; **fonte do número a confirmar**). Em aberto: descrição do −41% (design: estudo controlado N=20, BAI; site: média nos clientes CCA, Metro, Bayer), testemunhos ficam ou saem, "30 vs 38 sessões", repetir a explosão mais abaixo. Isto contraria a regra "site claro" do CLAUDE.md/DESIGN.md para a Home — decisão do Pedro.
