export type CallbackNotificationData = {
  name: string;
  phone: string;
  organization: string;
  email: string;
  message: string;
  source: string;
};

// [TODO: Resend env változók] — állítsd be a Vercel / .env.local fájlban:
// RESEND_API_KEY, NOTIFICATION_EMAIL_FROM, NOTIFICATION_EMAIL_TO.
// Lásd .env.example.
export async function sendCallbackNotificationEmail(
  data: CallbackNotificationData,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NOTIFICATION_EMAIL_FROM;
  const to = process.env.NOTIFICATION_EMAIL_TO;

  if (!apiKey || !from || !to) {
    console.error(
      "[callback-notification] Resend nincs konfigurálva — lásd .env.example ([TODO: Resend env változók]).",
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
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: `Új visszahívás-kérés — ${data.name}`,
        text: lines.join("\n"),
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error(`[callback-notification] Resend API error (${response.status}):`, body);
    }
  } catch (error) {
    console.error("[callback-notification] Resend send error:", error);
  }
}
