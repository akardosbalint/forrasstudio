import { Prisma } from "@/generated/prisma/client";

// Az adatbázis-szintű "bookings_no_overlap_confirmed" EXCLUDE constraint
// (lásd prisma/schema.prisma Booking modell megjegyzése és
// prisma/migrations/20260730125823_booking_no_overlap_constraint)
// megsértését ismeri fel — ez a végső, konkurrencia-biztos védelem az
// ütköző foglalások ellen, az alkalmazás-szintű `isBookableSlot`
// ellenőrzés (ami maga nem atomi) mellett. Prisma 7-ben a driver adapter
// a nyers Postgres hibakódot (23P01 = exclusion_violation) a
// `meta.driverAdapterError.cause.code` alá csomagolja egy generikus
// P2039 kóddal — ezért a nested kódot nézzük, a constraint nevét pedig
// tartalék jelzésként (ha a hiba-alak driver-verziók között változna).
export function isBookingOverlapConstraintError(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false;

  const meta = error.meta as
    | { driverAdapterError?: { cause?: { code?: string } } }
    | undefined;
  if (meta?.driverAdapterError?.cause?.code === "23P01") return true;

  return error.message.includes("bookings_no_overlap_confirmed");
}
