import { getSmtpTransporter, getSenderAddress } from "@/lib/email/smtpTransport";

export type CallbackNotificationData = {
  name: string;
  phone: string;
  organization: string;
  email: string;
  message: string;
  source: string;
};

// SMTP env változók (Google Workspace) — állítsd be a Vercel / .env.local
// fájlban: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD,
// NOTIFICATION_EMAIL_TO. Lásd .env.example.
export async function sendCallbackNotificationEmail(
  data: CallbackNotificationData,
): Promise<void> {
  const transporter = getSmtpTransporter();
  const from = getSenderAddress();
  const to = process.env.NOTIFICATION_EMAIL_TO;

  if (!transporter || !from || !to) {
    console.error(
      "[callback-notification] SMTP nincs konfigurálva — lásd .env.example (SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASSWORD / NOTIFICATION_EMAIL_TO).",
    );
    return;
  }

  const sourceLabel =
    data.source === "hero-mini"
      ? "hero"
      : data.source === "final-cta"
        ? "záró CTA"
        : data.source;

  const lines = [`Forrás: ${sourceLabel}`, `Név: ${data.name}`, `Telefon: ${data.phone}`];
  if (data.organization) lines.push(`Cég / szervezet: ${data.organization}`);
  if (data.email) lines.push(`Email: ${data.email}`);
  if (data.message) lines.push(`Üzenet: ${data.message}`);

  try {
    await transporter.sendMail({
      from,
      to,
      subject: `Új visszahívás-kérés — ${data.name}`,
      text: lines.join("\n"),
    });
  } catch (error) {
    console.error("[callback-notification] SMTP send error:", error);
  }
}
