-- Adatbázis-szintű védelem az ütköző (átfedő) discovery call foglalások
-- ellen, ugyanahhoz a rephez. Az alkalmazás-szintű ellenőrzés
-- (lib/booking/rules.ts hasConflict/isBookableSlot) egy read-then-write
-- lépés, ami konkurrens kérések esetén race condition-nek van kitéve —
-- ez a constraint garantálja az atomicitást magán az adatbázisonyon,
-- függetlenül attól, hány egyidejű kérés próbál ugyanarra az időpontra
-- foglalni. A Prisma séma nem tudja kifejezni az EXCLUDE constraintot,
-- ezért ez kézzel írt SQL migráció — lásd prisma/schema.prisma Booking
-- modell megjegyzése.
--
-- btree_gist szükséges, hogy a GiST index kezelni tudja az egyenlőségi
-- (rep_id) feltételt a tartomány-átfedés (idősáv) mellett.
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "bookings"
  ADD CONSTRAINT "bookings_no_overlap_confirmed"
  EXCLUDE USING gist (
    "rep_id" WITH =,
    tsrange("starts_at", "ends_at", '[)') WITH &&
  )
  WHERE ("status" = 'CONFIRMED');
