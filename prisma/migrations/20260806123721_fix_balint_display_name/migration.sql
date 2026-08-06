-- Adatjavítás: az első CRM-belépéskor a Profile.name a bootstrap logika
-- (lib/auth/rbac.ts ensureProfile) miatt automatikusan az email cím "@"
-- előtti része lett ("balint"), amíg nem volt admin felület a
-- megjelenített név szerkesztésére. Innentől van rá önkiszolgáló felület
-- (/crm/settings/profile), de a már létező sort ez a migráció javítja.
UPDATE public.profiles
SET name = 'Kardos Bálint'
WHERE email = 'balint@miepitettuk.hu';
