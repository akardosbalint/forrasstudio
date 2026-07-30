import "dotenv/config";
import { syncAllConnectedCalendars } from "../lib/google/sync";
import { sendDueReminders } from "../lib/reminders/send";

// Egyetlen lefutás: Google Calendar szinkron (törölt/áthelyezett külső
// események észlelése) + esedékes emlékeztető emailek kiküldése. Cron-nal
// vagy a docker-compose.yml "scheduler" service-ével hívandó rendszeresen
// (pl. 5 percenként) — lásd README "Háttérfolyamatok" szekció.
async function main() {
  console.log(`[scheduled-tasks] Futás indul: ${new Date().toISOString()}`);

  try {
    await syncAllConnectedCalendars();
    console.log("[scheduled-tasks] Google Calendar szinkron kész.");
  } catch (error) {
    console.error("[scheduled-tasks] Google Calendar szinkron hiba:", error);
  }

  try {
    await sendDueReminders();
    console.log("[scheduled-tasks] Emlékeztető emailek kiküldve.");
  } catch (error) {
    console.error("[scheduled-tasks] Emlékeztető küldési hiba:", error);
  }
}

main().then(() => process.exit(0));
