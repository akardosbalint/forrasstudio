import { getSmtpTransporter, getSenderAddress } from "./smtpTransport";

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  text: string;
  attachments?: { filename: string; content: string }[];
};

// Általános célú SMTP email küldő a CRM automatizált leveleihez
// (kérdőív-meghívó, foglalás-visszaigazolás, emlékeztető...). A landing
// page saját visszahívás-értesítője (lib/notifications.ts) külön modul
// marad, hogy a meglévő működése ne változzon.
export async function sendTransactionalEmail({
  to,
  subject,
  html,
  text,
  attachments,
}: SendEmailParams): Promise<{ ok: boolean; error?: string }> {
  const transporter = getSmtpTransporter();
  const from = getSenderAddress();

  if (!transporter || !from) {
    const message =
      "[crm-email] SMTP nincs konfigurálva — lásd .env.example (SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASSWORD).";
    console.error(message);
    return { ok: false, error: message };
  }

  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        encoding: "base64" as const,
      })),
    });

    return { ok: true };
  } catch (error) {
    const message = `[crm-email] SMTP send error: ${String(error)}`;
    console.error(message);
    return { ok: false, error: message };
  }
}
