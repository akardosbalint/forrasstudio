import twilio from "twilio";

export type CallbackNotificationData = {
  name: string;
  phone: string;
  organization: string;
  email: string;
  message: string;
  source: string;
};

// [TODO: Twilio env változók] — állítsd be a Vercel / .env.local fájlban:
// TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER,
// NOTIFICATION_SMS_TO. Lásd .env.example.
export async function sendCallbackNotificationSms(
  data: CallbackNotificationData,
): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;
  const toNumber = process.env.NOTIFICATION_SMS_TO;

  if (!accountSid || !authToken || !fromNumber || !toNumber) {
    console.error(
      "[callback-notification] Twilio nincs konfigurálva — lásd .env.example ([TODO: Twilio env változók]).",
    );
    return;
  }

  const sourceLabel =
    data.source === "hero-mini"
      ? "hero"
      : data.source === "final-cta"
        ? "záró CTA"
        : data.source;

  const bodyParts = [
    `Új visszahívás-kérés (${sourceLabel}):`,
    `${data.name}, ${data.phone}`,
  ];
  if (data.organization) {
    bodyParts.push(data.organization);
  }

  try {
    const client = twilio(accountSid, authToken);
    await client.messages.create({
      body: bodyParts.join(" – "),
      from: fromNumber,
      to: toNumber,
    });
  } catch (error) {
    console.error("[callback-notification] Twilio send error:", error);
  }
}
