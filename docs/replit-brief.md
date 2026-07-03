# Brief para o Replit — redesign Neroes

Cola isto (ou uma versão adaptada) como prompt inicial no Replit Agent, para que o output volte compatível com o que vai ser integrado aqui.

---

Constrói o site institucional da Neroes de raiz — **design visual 100% original**, sem copiar layout, paleta ou tipografia de nenhum site existente da empresa.

**Stack obrigatória**
- Next.js (App Router) + TypeScript estrito
- Estrutura de pastas com `src/app`, `src/components`, `public/`
- Preparado para ligar a Supabase (não é preciso configurar agora, só não bloquear a integração depois)
- Sem dependência de nada específico do Replit que impeça correr depois com `next dev` / deploy na Vercel

**Acessibilidade — não negociável (WCAG 2.2 AA)**
- Um único `<h1>` por página, hierarquia de headings sem saltos
- Todo o input de formulário com `<label>` associada (nunca só placeholder)
- Grupos de escolha (ex. consentimento) como checkbox único ou `radiogroup`, nunca duas checkboxes independentes para a mesma decisão
- Mensagens de erro/sucesso de formulários anunciadas via `aria-live`
- Alt text descritivo em toda a imagem com informação (logótipos, fotos de equipa, gráficos); `alt=""` só em decorativas
- Contraste de texto ≥ 4.5:1 (normal) / 3:1 (grande); alvo de toque ≥ 24×24px
- `rel="noopener noreferrer"` em todo o link `target="_blank"`
- Foco visível em todos os elementos interativos; qualquer carrossel com pausa e sem autoplay forçado
- Navegação por teclado completa

**Estrutura de páginas** (ver `docs/content-inventory.md` para conteúdo completo, textos verbatim, estatísticas e contactos)

- Home
- Brain Experience (produto/evento corporate)
- Mental Health Calculator (ferramenta interativa — um único componente, não duplicado)
- About Us / Team (com fotos reais da equipa)
- Contact (uma única página, não uma por secção)
- Sport (about, science, services, contact) — **integrado no mesmo design system do resto do site**, não como sub-marca com header/menu próprios
- Privacy Policy / Terms and Conditions

**Regras de conteúdo**
- Usar os textos, estatísticas e testemunhos de `docs/content-inventory.md` como base — não inventar novos números/factos.
- Não replicar as inconsistências já identificadas (moradas diferentes, nomes de entidade diferentes, domínios de email diferentes) — usar um único conjunto de dados de contacto por decisão do cliente.
- Não recriar os problemas de UX listados na secção 4 do inventário (falta de H1, formulários sem labels, links `/new/...` partidos, imagens sem alt, etc.).

**Identidade visual**
- Cores de marca já usadas pela Neroes: azul `#0295C9` e dourado `#D99921` — ponto de partida, não restrição rígida.
- Se existir, consultar `_referencia/brand/` para logo e manual de normas (a confirmar se já foi criada).
- Tom: tecnologia de neurociência aplicada a performance humana (corporate wellness + performance desportiva) — referência de qualidade de UX/UI: swordhealth.com.
