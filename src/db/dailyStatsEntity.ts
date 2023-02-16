import { db } from "@jaws/services/firestoreService";
import { DailyStats } from "./dailyStatsMeta";
export async function getDailyStats({
  startDate,
  endDate,
  accountId,
}: {
  /** Format: YYYY-MM-DD (inclusive) */
  startDate: string;
  /** Format: YYYY-MM-DD (inclusive) */
  endDate: string;
  accountId: string;
}) {
  return (
    await db
      .collection("daily-stats")
      .where("accountId", "==", accountId)
      .where("date", ">=", startDate)
      .where("date", "<=", endDate)
      .orderBy("date", "asc")
      .get()
  ).docs.map((doc) => doc.data()) as DailyStats[];
}

export async function upsertDailyStats(stats: DailyStats) {
  return db
    .collection("daily-stats")
    .doc(generateDocId(stats.accountId, stats.date))
    .set(stats);
}

function generateDocId(accountId: string, date: string) {
  return `${date.replace(/-/g, "")}-${accountId}`;
}
