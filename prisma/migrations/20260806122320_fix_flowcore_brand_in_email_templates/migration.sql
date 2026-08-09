-- Adatjavítás: az email_templates sorokat a "FlowCore" márkanév alatt
-- seedeltük eredetileg (lib/email/fallbackTemplates.ts). A rebrand után a
-- kód-oldali fallback tartalom már "MI Építettük"-re frissült, de a
-- prisma/seed.ts upsert-je "update: {}" -t használ, ami SOHA nem írja
-- felül a már létező sorokat — így a korábban létrehozott sorokban a régi
-- márkanév megmaradt. Ez a migráció az éles adatbázisban is elvégzi a
-- cserét, csak azokon a sorokon, amik ténylegesen tartalmazzák a régi nevet.
UPDATE public.email_templates
SET
  subject = regexp_replace(subject, 'flowcore', 'MI Építettük', 'gi'),
  body_html = regexp_replace(body_html, 'flowcore', 'MI Építettük', 'gi'),
  body_text = regexp_replace(body_text, 'flowcore', 'MI Építettük', 'gi')
WHERE
  subject ~* 'flowcore'
  OR body_html ~* 'flowcore'
  OR body_text ~* 'flowcore';
