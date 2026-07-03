# Website Neroes — contexto do projeto

Reconstrução completa do site institucional da Neroes: WordPress (Elementor) → **Next.js + TypeScript**, com **Supabase** (dados/auth/storage), alojado na **Vercel**, deploy automático via **GitHub**. Referência de qualidade visual/UX: swordhealth.com.

## Estado atual (2026-07-02)

- Fase de análise concluída: auditoria completa do WordPress atual em `docs/content-inventory.md` (inventário de páginas, conteúdo verbatim a preservar, problemas de UX/UI/acessibilidade encontrados).
- Fase seguinte: redesign visual **100% original** a decorrer no Replit (sem reaproveitar layout/estilos do WordPress antigo). O código produzido no Replit será trazido para este repositório para integração e revisão.
- Ainda não existe nenhum código Next.js neste repositório — `src/`, `public/`, `package.json`, etc. só serão criados quando o output do Replit chegar.

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
