import "server-only";

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

// Általános célú Resend email küldő a CRM automatizált leveleihez
// (kérdőív-meghívó, foglalás-visszaigazolás, emlékeztető...). A landing
// page saját visszahívás-értesítője (lib/notifications.ts) külön modul
// marad, hogy a meglévő működése ne változzon.
export async function sendTransactionalEmail({
  to,
  subject,
  html,
  text,
}: SendEmailParams): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NOTIFICATION_EMAIL_FROM;

  if (!apiKey || !from) {
    const message =
      "[crm-email] Resend nincs konfigurálva — lásd .env.example ([TODO: Resend env változók]).";
    console.error(message);
    return { ok: false, error: message };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html, text }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      const message = `[crm-email] Resend API error (${response.status}): ${body}`;
      console.error(message);
      return { ok: false, error: message };
    }

    return { ok: true };
  } catch (error) {
    const message = `[crm-email] Resend send error: ${String(error)}`;
    console.error(message);
    return { ok: false, error: message };
  }
}
