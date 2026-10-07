# Website Neroes

> **TL;DR** — Reconstrução completa do website da Neroes: WordPress → Next.js + TypeScript, com Supabase (base de dados), Vercel (alojamento) e deploy automático via GitHub.

---

## Serviços utilizados

| Serviço | Função |
|---|---|
| **Next.js + TypeScript** | Frontend / App (App Router) |
| **Supabase** | Base de dados, autenticação e storage |
| **Vercel** | Alojamento e deploy automático |
| **GitHub** | Repositório de código (`neroes-website`) |
| **Claude Code** | Assistente de desenvolvimento (VS Code) |
| **Replit** | Redesign visual de raiz |

---

## Funcionalidades

- Site institucional moderno e minimalista (referência: swordhealth.com)
- Acessibilidade WCAG 2.2 AA
- Design responsivo (mobile, tablet, desktop)
- Deploy automático a cada push para `main`
- Preview deployment automático por branch/PR

---

## Estrutura de pastas

```
Website Neroes/
├── _referencia/
│   ├── wordpress/        # Exportação estática do site WordPress atual (só referência)
│   └── brand/            # Logo e manual de normas da Neroes
├── src/                  # Código fonte Next.js (criado na fase de desenvolvimento)
├── public/               # Assets públicos
├── .env.local            # Variáveis de ambiente (nunca vai para o GitHub)
├── .env.example          # Template de variáveis (vai para o GitHub)
├── .gitignore
├── CLAUDE.md             # Contexto do projeto para o Claude Code
└── README.md
```

---

## Variáveis de ambiente necessárias

Cria um ficheiro `.env.local` na raiz a partir do `.env.example` (valores fornecidos pelo Head of Tech):

```
# Agenda do site (Contacto): onde ficam as marcações
BOOKING_STORE=supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Emails da agenda (Google Workspace: conta @neroes.tech + palavra-passe de app)
SMTP_USER=
SMTP_PASS=

# Alternativa: agenda externa embutida (Google Calendar ou Calendly)
NEXT_PUBLIC_BOOKING_URL=
```

- **Agenda do site:** ver a secção "Agenda" abaixo.
- `NEXT_PUBLIC_BOOKING_URL`: o link da agenda de marcações do Google Calendar (Partilhar → Incorporar no site; pode colar-se o código `<iframe>` inteiro) ou de um evento Calendly. Sem ele, a página Contacto mostra email e telefone em vez do calendário. (`NEXT_PUBLIC_CALENDLY_URL`, o nome antigo, continua a funcionar.)
- As variáveis `NEXT_PUBLIC_*` entram no build: depois de as mudar na Vercel (Settings → Environment Variables), é preciso fazer **redeploy**.
- ⚠️ **As chaves do Supabase nunca vão para o GitHub** — só para o `.env.local` (local) e para as Environment Variables da Vercel.

---

## Agenda (página Contacto)

A página Contacto tem uma agenda própria: um calendário com os dias **com horários livres**, **ocupados** e **sem conversas** (fins de semana, feriados), a lista de horários do dia escolhido (os já marcados aparecem como "Ocupado") e o formulário de marcação. Ao marcar, a pessoa vê a confirmação com "Adicionar ao Google Calendar" e o convite `.ics`; a equipa e a pessoa recebem email (se o SMTP estiver configurado).

- **Horário de atendimento, duração, aviso mínimo e feriados:** `src/lib/scheduling/availability.ts` (`SCHEDULE`). Por defeito: segunda a sexta, 10:00–13:00 e 14:00–18:00 (hora de Lisboa), conversas de 30 min, pelo menos 12 h de antecedência, até 60 dias à frente, sem feriados nacionais nem o 13 de junho.
- **Onde ficam as marcações:** Supabase, tabelas `bookings` e `booking_blocks` (`docs/sql/bookings.sql`, com exemplos para ver, cancelar e bloquear dias). A base de dados recusa duas marcações para o mesmo horário.
- **Pôr no ar:**
  1. Criar um projeto no Supabase e correr `docs/sql/bookings.sql` no SQL Editor.
  2. Na Vercel (Production e Preview): `BOOKING_STORE=supabase`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, e para os emails `SMTP_USER` + `SMTP_PASS`.
  3. Redeploy.
- **Localmente** (`npm run dev`) a agenda funciona sem configurar nada: as marcações ficam num ficheiro na pasta temporária do sistema (`BOOKING_FILE` muda o caminho).
- **Testes:** `npm test` (lógica de horários, feriados, validação, armazenamento) e, com `npm run dev` a correr, `npm run test:e2e` (API de ponta a ponta).

---

## Como correr localmente

```bash
# Instalar dependências
npm install

# Correr em desenvolvimento
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) no navegador.

---

## Deploy

- Branch `main` → produção automática na Vercel
- Cada branch/PR gera um preview deployment automático

---

## Equipa

| Papel | Responsável |
|---|---|
| Head of Tech | Bruno Sousa |
| Desenvolvimento | Wendell Alves |
