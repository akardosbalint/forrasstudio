-- Migráció a MÁR ÉLŐ callback_requests táblához (amit a korábbi
-- supabase/schema.sql alapján hoztál létre, még a consent oszlop és
-- policy nélkül). Futtasd le egyszer a Supabase SQL Editorban.
--
-- Ha most hozod létre a projektet elölről, nincs szükség erre a fájlra:
-- elég a supabase/schema.sql-t lefuttatni, az már tartalmazza ezt.

alter table public.callback_requests
  add column if not exists consent boolean not null default false;

drop policy if exists "service role can insert callback requests" on public.callback_requests;
drop policy if exists "anon can insert callback requests" on public.callback_requests;

create policy "anon can insert callback requests"
  on public.callback_requests
  for insert
  to anon
  with check (consent = true);
