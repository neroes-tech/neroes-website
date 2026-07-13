# Website Neroes — contexto do projeto

Reconstrução completa do site institucional da Neroes: WordPress (Elementor) → **Next.js + TypeScript**, com **Supabase** (dados/auth/storage), alojado na **Vercel**, deploy automático via **GitHub**. Referência de qualidade visual/UX: swordhealth.com.

## Estado atual (2026-07-10)

- Auditoria do WordPress original concluída em `docs/content-inventory.md` (inventário de páginas, conteúdo verbatim a preservar, problemas de UX/UI/acessibilidade encontrados).
- O redesign Next.js já está em curso neste repositório (`src/`, `public/`, `package.json` existem e evoluem normalmente via commits/PRs) — a fase "à espera do output do Replit" ficou para trás.
- Ver secções abaixo para a arquitetura e design system atuais.

## Fluxo de trabalho Replit → aqui

1. O redesign visual é feito no Replit a partir do zero (design tokens novos, sem herdar nada do WordPress antigo).
2. O código é trazido para este repositório (import manual ou via git).
3. Aqui, o Claude Code:
   - verifica paridade de conteúdo contra `docs/content-inventory.md` (nada que devia ser preservado pode desaparecer sem essa ser uma decisão consciente);
   - corrige/reforça acessibilidade para WCAG 2.2 AA (ver checklist abaixo);
   - resolve os problemas de UX identificados na auditoria (ver `docs/content-inventory.md`, secção 4) — nenhum deve ser reintroduzido no redesign;
   - liga o projeto ao Supabase e prepara para deploy na Vercel;
   - garante TypeScript estrito, estrutura de pastas consistente e performance (Core Web Vitals).
4. Commits/PRs normais a partir daqui.

## Regras do redesign

- **Sem reaproveitamento visual do site antigo** — paleta, tipografia e layout são novos. `_referencia/wordpress/` serve só para extrair texto/factos, nunca para copiar estilo.
- **Um único design system**, não um mega-menu "corporate" e outro "sport" como no site atual — a auditoria identificou isto como o maior problema estrutural do site existente.
- Stack: Next.js (App Router), TypeScript estrito, Supabase como backend, pronto para Vercel.
- Conteúdo institucional deve resolver as inconsistências já detetadas antes de ir para produção (ver "Decisões de conteúdo em aberto" em `docs/content-inventory.md`) — não replicar moradas/emails/telefones divergentes.

## Acessibilidade — barra mínima (WCAG 2.2 AA)

Itens que a auditoria mostrou estarem sistematicamente ausentes no site atual e que são critério de aceitação para o novo código:

- Um único `<h1>` por página, hierarquia de headings sem saltos.
- Todos os inputs de formulário com `<label>` associada (não só placeholder).
- Grupos de escolha (ex. consentimento RGPD) como checkbox único ou `radiogroup`, nunca duas checkboxes independentes.
- Mensagens de erro/sucesso de formulários anunciadas a leitores de ecrã (`aria-live`, nunca `aria-hidden="true"` na resposta).
- Alt text descritivo em imagens com informação (logótipos de parceiros, fotos de equipa, gráficos de dados) — `alt=""` só em decorativas.
- Contraste de texto ≥ 4.5:1 (normal) / 3:1 (grande), alvo de toque ≥ 24×24px (WCAG 2.2 SC 2.5.8).
- `rel="noopener noreferrer"` em todos os links `target="_blank"`.
- Foco visível em todos os elementos interativos; navegação por teclado completa (incluindo carrosséis — com pausa e sem autoplay forçado).
- `lang` correto e consistente por página (o site atual mistura `en-US` com conteúdo/atributos em `pt-PT` via TranslatePress — evitar esse padrão).

## Fontes de conteúdo

- `docs/content-inventory.md` — inventário e conteúdo a preservar (fonte de verdade para copy/textos/estatísticas/contactos).
- `_referencia/wordpress/` — export estático do WordPress, só para consulta pontual (não versionado, está no `.gitignore`).
- `_referencia/brand/` — **ainda não existe neste repositório**; precisa de ser criada com logo e manual de normas antes do Replit fixar paleta/tipografia definitivas. Cores de marca já confirmadas no CSS do site antigo: azul `#0295C9` e dourado `#D99921` — usar como ponto de partida, não como restrição rígida.

## Variáveis de ambiente

Ver `.env.example`. Nunca commitar `.env.local` (já está no `.gitignore`).

## Equipa

| Papel | Responsável |
|---|---|
| Head of Tech | Bruno Sousa |
| Desenvolvimento | Wendell Alves |

---

# Neroes Project — Claude Context Guide

Este ficheiro serve como o mapa de contexto e otimização permanente para as sessões do Claude Code neste repositório. Consulta este guia antes de ler a árvore de ficheiros completa para economizar tokens (Prompt Caching).

## 🧭 Arquitetura e Localizações-Chave
* **Core:** Next.js (App Router) + TypeScript + Tailwind CSS.
* **Componente do Cérebro 3D:** `src/components/BrainHero.tsx` (Usa Three.js e a diretiva `"use client"`).
* **Página Principal (Hero Section):** `src/app/page.tsx` (Onde o `<BrainHero />` está renderizado como background).
* **Logótipos de Parceiros Oficiais:** `public/partners/` (Contém as imagens oficiais em formato `.png` da KPMG, BGI, IPN, IBEB, FCUL e Portugal Ventures).

## 🎨 Guia de Estilo e Design System (Neroes Light)
* **Fundo Oficial (Off-White):** `#FAFAF7` (Deve ser aplicado como fundo principal das secções premium).
* **Texto Principal (Escuro):** `#1E2233` (Tipografia limpa e de alto contraste).
* **Azul de Destaque (Brand Blue):** `#1E5BFF` (Usado para spans, links, botões e nós sinápticos).
* **Efeito Premium de Parceiros:** `grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300` (Aplicado uniformemente na grelha de logos).

## ⚡ Diretivas de Poupança de Tokens e Performance
1. **Prompt Caching:** Assume que já conheces a estrutura das pastas após a primeira leitura. Não executes `ls` ou leituras de ficheiros globais repetidamente.
2. **Consultas Cirúrgicas:** Quando te pedir para alterar um componente, lê apenas esse ficheiro específico (ex: `src/components/BrainHero.tsx`) usando ferramentas de leitura direcionada em vez de ler pastas inteiras.
3. **Respostas Concisas:** Foca-te em alterações de código diretas e precisas. Evita explicações teóricas longas sobre Next.js ou Tailwind, a menos que seja explicitamente solicitado.
4. **Verificações de Segurança:** Nunca instales pacotes CLI globais (`-g`) ou scripts de repositórios não validados pelo ecossistema oficial do npm.
