import nodemailer from "nodemailer";

// Megosztott, hitelesített SMTP transporter (pl. Google Workspace
// smtp.gmail.com-on keresztül) — a modul-szintű cache-elés miatt egy
// process életciklusa alatt csak egyszer épül fel a kapcsolat.
//
// Fontos: Vercel serverless függvényekről csak HITELESÍTETT SMTP (SMTP AUTH,
// app jelszóval) működik — a Google Workspace "IP-alapú SMTP relay"
// szolgáltatása (Admin Console → Gmail → Routing) fix, engedélyezett
// forrás-IP-khez van kötve, ami a Vercel dinamikus IP-ivel nem kompatibilis.
let cachedTransporter: nodemailer.Transporter | null = null;

export function getSmtpTransporter(): nodemailer.Transporter | null {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return cachedTransporter;
}

// A Gmail/Workspace SMTP a "From" fejlécet csendben felülírja a
// hitelesített fiók címére, hacsak az nem egyezik a SMTP_USER-rel, vagy
// nincs Gmail-ben "Send As" aliasként beállítva — ezért alapértelmezésként
// mindig a hitelesített fiókot adjuk vissza, a NOTIFICATION_EMAIL_FROM
// csak akkor felülbírálás, ha explicit be van állítva.
export function getSenderAddress(): string | undefined {
  return process.env.NOTIFICATION_EMAIL_FROM || process.env.SMTP_USER;
}
