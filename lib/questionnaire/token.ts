import { randomBytes } from "node:crypto";

const DEFAULT_TTL_DAYS = 14;

export function generateQuestionnaireToken(): string {
  return randomBytes(32).toString("base64url");
}

export function questionnaireLinkExpiry(from: Date = new Date()): Date {
  const ttlDays = Number(process.env.QUESTIONNAIRE_LINK_TTL_DAYS) || DEFAULT_TTL_DAYS;
  return new Date(from.getTime() + ttlDays * 24 * 60 * 60 * 1000);
}
