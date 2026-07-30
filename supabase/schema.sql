-- KBCo Stúdió — visszahívás-kérés tábla
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
  source text not null default 'unknown', -- pl. 'hero-mini' vagy 'final-cta'
  consent boolean not null default false -- GDPR: az adatkezelési tájékoztató elfogadása
);

alter table public.callback_requests enable row level security;

-- A landing page API route-ja a publishable (anon) kulccsal ír a táblába —
-- ez a policy csak insertet enged, select/update/delete-et nem (nincs rá
-- policy, az RLS alapból tiltja). A "consent = true" feltétel az
-- adatvédelmi hozzájárulást adatbázis-szinten is kikényszeríti, az API
-- route-beli szerveroldali validáció mellett (lásd app/api/callback-request).
create policy "anon can insert callback requests"
  on public.callback_requests
  for insert
  to anon
  with check (consent = true);
