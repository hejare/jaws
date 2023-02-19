import { db } from "@jaws/services/firestoreService";
import { firestore } from "firebase-admin";
import { DailyStats } from "./dailyStatsMeta";
export async function getDailyStats({
  startDate,
  endDate,
  accountId,
}: {
  /** Format: YYYY-MM-DD (inclusive) */
  startDate: Date;
  /** Format: YYYY-MM-DD (inclusive) */
  endDate: Date;
  accountId: string;
}) {
  return (
    await db
      .collection("daily-stats")
      .where("accountId", "==", accountId)
      .where("date", ">=", new firestore.Timestamp(startDate.getTime() / 1000, 0))
      .where("date", "<=", new firestore.Timestamp(endDate.getTime() / 1000, 0))
      .orderBy("date", "asc")
      .get()
  ).docs.map((doc) => doc.data()) as DailyStats[];
}

export async function getStatByDocId(docId: string) {
  return (
    await db.collection("daily-stats").doc(docId).get()
  ).data() as DailyStats;
}

export async function upsertDailyStats(stats: DailyStats) {
  return db
    .collection("daily-stats")
    .doc(generateDocId(stats.accountId, stats.date))
    .set(stats);
}

export function generateDocId(accountId: string, date: firestore.Timestamp) {
  const jsDate = date.toDate();
  return `${jsDate.toISOString().replace(/-/g, "").split("T")[0]}-${accountId}`;
}
