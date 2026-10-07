-- Agenda do site (página Contacto) — tabelas no Supabase.
-- Correr uma vez no Supabase: SQL Editor → New query → colar → Run.
-- Usado por src/lib/scheduling/store.ts (com a SUPABASE_SERVICE_ROLE_KEY,
-- só no servidor). RLS ligado e sem políticas: o browser (chave anon) não
-- consegue ler nem escrever nada destas tabelas.

-- Marcações feitas pelo site.
create table if not exists public.bookings (
  id          uuid primary key default gen_random_uuid(),
  slot_start  timestamptz not null,
  slot_end    timestamptz not null,
  name        text not null check (char_length(name) between 2 and 100),
  email       text not null check (char_length(email) <= 254),
  company     text check (char_length(company) <= 120),
  phone       text check (char_length(phone) <= 40),
  message     text check (char_length(message) <= 1000),
  locale      text not null default 'pt' check (locale in ('pt', 'en')),
  status      text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  -- false enquanto o email para a equipa não tiver saído: ver "Marcações sem aviso" abaixo.
  team_notified boolean not null default false,
  created_at  timestamptz not null default now(),
  check (slot_end > slot_start)
);

-- A base de dados recusa uma segunda marcação confirmada para o mesmo horário,
-- mesmo que dois pedidos cheguem ao mesmo tempo (erro 23505 → "ocupado").
create unique index if not exists bookings_slot_unique
  on public.bookings (slot_start) where status = 'confirmed';
create index if not exists bookings_slot_range on public.bookings (slot_start, slot_end);
-- Limites anti-abuso: marcações futuras por email e marcações na última hora.
create index if not exists bookings_email on public.bookings (email);
create index if not exists bookings_created on public.bookings (created_at);

-- Períodos em que a equipa não está disponível (aparecem como "Ocupado").
create table if not exists public.booking_blocks (
  id          uuid primary key default gen_random_uuid(),
  starts_at   timestamptz not null,
  ends_at     timestamptz not null,
  reason      text,
  created_at  timestamptz not null default now(),
  check (ends_at > starts_at)
);
create index if not exists booking_blocks_range on public.booking_blocks (starts_at, ends_at);

alter table public.bookings enable row level security;
alter table public.booking_blocks enable row level security;

-- ─────────────────────────────────────────────────────────────────────────
-- Uso no dia a dia (Table Editor ou SQL Editor):
--
-- Ver as próximas marcações:
--   select slot_start at time zone 'Europe/Lisbon' as hora_lisboa, name, email, company, phone, message
--   from public.bookings where status = 'confirmed' and slot_start > now() order by slot_start;
--
-- Marcações sem aviso (o email para a equipa falhou — confirmar à mão):
--   select slot_start at time zone 'Europe/Lisbon' as hora_lisboa, name, email, phone
--   from public.bookings where status = 'confirmed' and not team_notified order by slot_start;
--
-- Cancelar uma marcação (o horário volta a ficar livre no site):
--   update public.bookings set status = 'cancelled' where id = '…';
--
-- Marcar um dia inteiro como ocupado (ex.: 20 de outubro de 2026):
--   insert into public.booking_blocks (starts_at, ends_at, reason)
--   values ('2026-10-20 00:00 Europe/Lisbon', '2026-10-21 00:00 Europe/Lisbon', 'Feira');
--
-- Marcar só uma tarde:
--   insert into public.booking_blocks (starts_at, ends_at, reason)
--   values ('2026-10-22 14:00 Europe/Lisbon', '2026-10-22 18:00 Europe/Lisbon', 'Reunião interna');
