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

Cria um ficheiro `.env.local` na raiz com estas variáveis (fornecidas pelo Head of Tech):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

⚠️ **As chaves do Supabase nunca vão para o GitHub** — só para o `.env.local` (local) e para as Environment Variables da Vercel.

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
