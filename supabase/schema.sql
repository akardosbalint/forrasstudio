-- Forrás Stúdió — visszahívás-kérés tábla
-- Futtasd le a Supabase projekt SQL editorában (vagy migrációként),
-- miután a [TODO: Supabase env változók] be vannak állítva.

create table if not exists public.callback_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  organization text,
  email text,
  message text,
  source text not null default 'unknown' -- pl. 'hero-mini' vagy 'final-cta'
);

alter table public.callback_requests enable row level security;

-- Csak a szerver oldali (service role) kulccsal lehet beszúrni,
-- a landing page API route-ja ezen keresztül ír a táblába.
create policy "service role can insert callback requests"
  on public.callback_requests
  for insert
  to service_role
  with check (true);
