-- contact_submissions
-- Usada por src/app/api/contact/route.ts (POST /api/contact) para guardar
-- os envios do formulário de contacto.

create table if not exists public.contact_submissions (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  message    text,
  created_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

-- Sem policies de propósito.
--
-- O único escritor é o endpoint /api/contact, que usa o
-- SUPABASE_SERVICE_ROLE_KEY (ver src/lib/supabase/admin.ts). O service
-- role key ignora RLS por definição, por isso não precisa de nenhuma
-- policy para inserir dados.
--
-- Não existe nenhum caso de uso em que o cliente público (roles "anon"
-- ou "authenticated", usados pelo NEXT_PUBLIC_SUPABASE_ANON_KEY no
-- browser) deva ler ou escrever nesta tabela — os dados de contacto
-- incluem PII (nome, email, telefone, mensagem) e só devem ser
-- acedidos a partir do backend/dashboard do Supabase.
--
-- Por isso, com RLS ativo e zero policies, a tabela fica inacessível
-- a "anon" e "authenticated" (leitura e escrita bloqueadas), e continua
-- acessível ao service role key usado pelo backend.
